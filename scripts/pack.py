#!/usr/bin/python3
from os import walk, path
from PIL import Image


def walk_dirs(rootName):
    file_list = []
    for root, dirs, files in walk(rootName):
        for file in files:
            filepath = path.join(root, file)
            print(filepath)
            file_list.append(filepath)
    return file_list


def clip_nine_patch(file, output):
    img = Image.open(file)
    print(img.size)
    print(img.size[0])
    cropped = img.crop((1, 1, img.size[0] - 1, img.size[1] - 1))  # (left, upper, right, lower)
    cropped.save(output)


# walk_dirs(".")


clip_nine_patch("4.png", "2.png")
