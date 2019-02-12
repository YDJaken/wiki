**********************************

### 三维导航面板安装流程:

将static/js/Navigation 内的文件复制到cesium/Source/Widgets目录下
注册流程:
在cesium/Source/Cesium.js下添加 './Widgets/Navigation/viewerCesiumNavigationMixin'(文件目录)
和对应的变量名Widgets_Navigation_viewerCesiumNavigationMixin(实际注册对象)
最后添加Cesium['viewerCesiumNavigationMixin'] = Widgets_Navigation_viewerCesiumNavigationMixin;


**********************************