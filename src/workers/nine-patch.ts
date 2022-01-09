import os from "os";
import path from "path";
import process from "process";

import fse from "fs-extra";
import LogUtil from "src/common/utils/LogUtil";
import PathUtil from "src/common/utils/PathUtil";
import NinePatchUtil from "src/common/utils/NinePatchUtil";
import WORKER_TYPES from "src/common/enums/worker-types";
import fileCache from "src/main/singletons/fileCache";
import { getRandomUUID, resetDirectory } from "src/common/utils";

import type { TypeMsgData } from "src/types/worker";

const WORKER = `NinePatch`;

const log = (content: string) => LogUtil.worker(WORKER, `: ${content}`);

log("start");

process.on("exit", code => {
  log(`stop (${code})`);
});

process.on("disconnect", () => {
  log(`disconnect`);
});

process.on("message", async (data: TypeMsgData<WORKER_TYPES.ENCODE_9_PATCH>) => {
  console.time("耗时");
  if (!process.send) {
    console.warn(`${WORKER}: process does not has 'send' method`);
  }
  const { id, files } = data;
  log(`${files.length} 个文件处理任务`);
  const cacheRecord = NinePatchUtil.readCache();
  log(`读取缓存${Object.keys(cacheRecord).length}个`);

  // md5 => buffer
  // md5 唯一
  const uniqueRecord: Record<string, { getBuffer: () => Buffer }> = {};

  // 遍历文件，过滤相同 md5 的文件
  files.forEach(file => {
    const fileMd5 = fileCache.getMd5(file, false);
    if (
      !(fileMd5 in uniqueRecord) && // 若已经存在则不需要写入
      !(fileMd5 in cacheRecord) // 若已有缓存则不需要写入
    ) {
      uniqueRecord[fileMd5] = {
        getBuffer: () => fileCache.getBuffer(file, false)
      };
    }
  });

  // 真实要处理的文件
  const md5List = Object.keys(uniqueRecord);
  log(`去重后一共 ${md5List.length} 个文件`);

  if (md5List.length === 0) {
    log("无需处理");
    console.timeEnd("耗时");
    process.send?.({ id, list: md5List });
    return;
  }

  // 计算每个 worker 需要处理任务个数
  const cpuCount = os.cpus().length;
  log(`需要开启 ${cpuCount} 个进程处理文件`);
  const taskCount = Math.ceil(md5List.length / cpuCount);
  log(`每个 aapt 进程被分配 ${taskCount} 个文件`);

  // 开启多个 aapt 进程处理任务
  // 由于 aapt 一次只能处理一个目录，（TODO: 是否能有其他指令有待扒 aapt 源码寻找）
  // 生成 cpuCount 目录，开启 aapt 进程处理一个目录
  const queue = new Array(cpuCount);
  for (let i = 0; i < cpuCount; i++) {
    // 平均分配后写入不同的目录中等待 aapt 进程处理
    const tasks = md5List.slice(taskCount * i, taskCount * i + taskCount);
    if (tasks.length === 0) continue;

    // 每一个任务生成一个唯一 id
    const id = getRandomUUID();
    // 临时目录存放原始 .9 图
    const tempDir = path.join(PathUtil.NINEPATCH_TEMPORARY, `.${id}_`);
    const targetDir = path.join(PathUtil.NINEPATCH_TEMPORARY, `.${id}`);
    // 重置目录
    resetDirectory(tempDir);

    tasks.forEach(fileMd5 => {
      const buff = uniqueRecord[fileMd5].getBuffer();
      // 将原始文件写入临时目录
      const temp = path.join(tempDir, `${fileMd5}.9.png`);
      fse.writeFileSync(temp, buff);
    });

    queue.push(
      NinePatchUtil.encode9patchWithDir(tempDir, targetDir).then(() => {
        // 删除临时目录
        fse.removeSync(tempDir);
      })
    );
  }

  await Promise.all(queue);

  log("处理完毕");
  console.timeEnd("耗时");

  process.send?.({ id, list: md5List });
});
