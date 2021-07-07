#!/usr/bin/python3
import numbers

from PIL import Image


class NinePatch(str):
    def __init__(self, file: str):
        self.file = file
        self.image: Image.Image = Image.open(file)
        self.width = self.image.size[0]
        self.height = self.image.size[1]

    # 获取 .9 像素信息
    def get_nine_patch_data(self) -> Image:
        image = self.image.convert('RGBA')
        # 上边和下边
        for i in range(self.width):
            # top
            top = image.getpixel((i, 1))
            print("top:", top)
            # bottom
            bottom = image.getpixel((i, self.height - 1))
            print("bottom:", bottom)
        # 左边和右边
        for i in range(self.height):
            # left
            left = image.getpixel((1, i))
            print("left:", left)
            # right
            right = image.getpixel((self.width - 1, i))
            print("right:", right)
        return self.image

    # 裁剪 .9 区域
    def clip_nine_patch_area(self) -> Image:
        cropped = self.image.crop((1, 1, self.image.size[0] - 1, self.image.size[1] - 1))  # (left, upper, right, lower)
        return cropped

    # 写入 .9 信息
    @staticmethod
    def write_chunk() -> None:
        print("todo")


ninePatch = NinePatch("2.png")
#
print("width:", ninePatch.width)
ninePatch.get_nine_patch_data()



# print(walk_dirs("."))


# clip_nine_patch("2.png", "4.png")
# get_nine_patch_data("2.png")
# system("pause")
