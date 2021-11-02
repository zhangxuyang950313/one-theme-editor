cmd_Release/obj.target/canvas/src/ImageData.o := c++ -o Release/obj.target/canvas/src/ImageData.o ../src/ImageData.cc '-DNODE_GYP_MODULE_NAME=canvas' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-DV8_DEPRECATION_WARNINGS' '-DV8_IMMINENT_DEPRECATION_WARNINGS' '-D_DARWIN_USE_64_BIT_INODE=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DOPENSSL_NO_PINSHARED' '-DOPENSSL_THREADS' '-DHAVE_JPEG' '-DHAVE_GIF' '-DHAVE_RSVG' '-DBUILDING_NODE_EXTENSION' -I/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node -I/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/src -I/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/deps/openssl/config -I/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/deps/openssl/openssl/include -I/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/deps/uv/include -I/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/deps/zlib -I/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/deps/v8/include -I../../nan -I/usr/local/Cellar/libffi/3.3_3/include -I/usr/local/Cellar/cairo/1.16.0_5/include/cairo -I/usr/local/Cellar/glib/2.68.1/include -I/usr/local/Cellar/glib/2.68.1/include/glib-2.0 -I/usr/local/Cellar/glib/2.68.1/lib/glib-2.0/include -I/usr/local/opt/gettext/include -I/usr/local/Cellar/pcre/8.44/include -I/usr/local/Cellar/pixman/0.40.0/include/pixman-1 -I/usr/local/Cellar/fontconfig/2.13.1/include -I/usr/local/opt/freetype/include/freetype2 -I/usr/local/Cellar/libpng/1.6.37/include/libpng16 -I/usr/local/Cellar/libxcb/1.14_1/include -I/usr/local/Cellar/libxrender/0.9.10/include -I/usr/local/Cellar/libxext/1.3.4/include -I/usr/local/Cellar/libx11/1.7.0/include -I/usr/local/Cellar/libxau/1.0.9/include -I/usr/local/Cellar/libxdmcp/1.1.3/include -I/usr/local/Cellar/xorgproto/2021.3/include -I/usr/local/Cellar/pango/1.48.4/include/pango-1.0 -I/usr/local/Cellar/harfbuzz/2.8.0_1/include/harfbuzz -I/usr/local/Cellar/fribidi/1.0.10/include/fribidi -I/usr/local/Cellar/graphite2/1.3.14/include -I/usr/local/Cellar/librsvg/2.50.4/include/librsvg-2.0 -I/usr/local/Cellar/gdk-pixbuf/2.42.6/include/gdk-pixbuf-2.0 -I/usr/local/Cellar/libtiff/4.3.0/include  -Os -gdwarf-2 -mmacosx-version-min=10.10 -arch x86_64 -Wall -Wendif-labels -W -Wno-unused-parameter -std=gnu++1y -stdlib=libc++ -fno-rtti -fno-strict-aliasing -MMD -MF ./Release/.deps/Release/obj.target/canvas/src/ImageData.o.d.raw   -c
Release/obj.target/canvas/src/ImageData.o: ../src/ImageData.cc \
  ../src/ImageData.h ../../nan/nan.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node_version.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/errno.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/version.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/unix.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/threadpool.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/darwin.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8-internal.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8-version.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8config.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8-platform.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node_buffer.h \
  /Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node_object_wrap.h \
  ../../nan/nan_callbacks.h ../../nan/nan_callbacks_12_inl.h \
  ../../nan/nan_maybe_43_inl.h ../../nan/nan_converters.h \
  ../../nan/nan_converters_43_inl.h ../../nan/nan_new.h \
  ../../nan/nan_implementation_12_inl.h \
  ../../nan/nan_persistent_12_inl.h ../../nan/nan_weak.h \
  ../../nan/nan_object_wrap.h ../../nan/nan_private.h \
  ../../nan/nan_typedarray_contents.h ../../nan/nan_json.h \
  ../../nan/nan_scriptorigin.h ../src/Util.h
../src/ImageData.cc:
../src/ImageData.h:
../../nan/nan.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node_version.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/errno.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/version.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/unix.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/threadpool.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/uv/darwin.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8-internal.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8-version.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8config.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/v8-platform.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node_buffer.h:
/Users/zhangxuyang/.electron-gyp/Library/Caches/node-gyp/8.5.5/include/node/node_object_wrap.h:
../../nan/nan_callbacks.h:
../../nan/nan_callbacks_12_inl.h:
../../nan/nan_maybe_43_inl.h:
../../nan/nan_converters.h:
../../nan/nan_converters_43_inl.h:
../../nan/nan_new.h:
../../nan/nan_implementation_12_inl.h:
../../nan/nan_persistent_12_inl.h:
../../nan/nan_weak.h:
../../nan/nan_object_wrap.h:
../../nan/nan_private.h:
../../nan/nan_typedarray_contents.h:
../../nan/nan_json.h:
../../nan/nan_scriptorigin.h:
../src/Util.h:
