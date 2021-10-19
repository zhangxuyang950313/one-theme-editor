#### 封装 ipc 调用


main 和 render 配合使用


#### 调用生成器
 1. generateIpcRenderer 创建 ipc 调用 - 为异步 callback 形式
1.  generateIpcRendererSync 创建同步 ipc 调用

```ts
// 泛型 S 为输入参数，泛型 R 为输出结果

generateIpcRenderer<S, R>("event")("S 类型参数", {
  success(data: R) {
    // 成功
  },
  fail(err: string) {
    // 失败
  }
});

generateIpcRendererSync<S, R>("event")("S 类型参数"); // 同步返回 R 类型数据
```

#### 调用

在 preload 中预加载 Object.assign(window, { $server }) 在渲染进程直接调用

```ts
window.$server.xxx();
```
