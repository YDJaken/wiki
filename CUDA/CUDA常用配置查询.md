# GPU算力表

https://developer.nvidia.com/cuda-gpus#compute

# CUDA编程

https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#application-compatibility

```
if(NOT DEFINED CMAKE_CUDA_ARCHITECTURES)
  set(CMAKE_CUDA_ARCHITECTURES 61)
endif()
```