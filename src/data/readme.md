### 构造面向对象的数据模型

#### 抽象类 "AbstractDataModel" 构造了面向对象基本模型的 get 和 set 方法，继承它来编写更多数据模型


  ```typescript
 class MyDataModel extends AbstractDataModel<{ a: number, b: number}> {
   // 默认值
   protected data = {  a: 0, b: 0  }
  }
  // how to use
  new MyDataModel()
   .set("a", 1)    // ok
   .set("a", "a")  // error
   .set("b", 2)    // ok
   .set("c", 3)    // error
   .create()
  ```
