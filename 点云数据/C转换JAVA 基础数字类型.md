# C 转换 JAVA 基础数字类型

## 1 bytes:
```
C                            Java
BOOL                     =>  boolean
Char I1                  =>  short
Unsigned Character UI1   =>  char
```

## 2 bytes:
```
C                       Java
Signed Short I2     =>  short
Unsigned Short UI2  =>  int
```

### 4 bytes:
```
C                       Java
Signed Long I4      =>  int
Unsigned Long UI4   =>  long
IEEE Float   R4     =>  float
```

### 8 bytes:
```
C                                Java
Signed 8 byte integer I8     =>  long
Unsigned 8 byte integer UI8  =>  java.math.BigInteger
IEEE Double             R8   =>  double
```

### 10 bytes:
```
C                                       Java
Intel Extended precision Double R10 =>  暂无
```