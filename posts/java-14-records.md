---
title: Java records demystified
description: A guide to what records (a preview feature) in Java 14 offers
---

# {{ title }}

Java has always been verbose and almost all of us have accepted the fact and are used to its verbosity. We generally take the help of our super-intelligent IDEs or libraries like [lombok](https://projectlombok.org/) to generate most of the boilerplate code.

Still, when it comes down to doing super simple things like creating a data carrier class (which is as dumb as it sounds), a simple DTO or a value object we always feel the need to have something quick and embedded in Java itself.

## Presenting, records

_records_ are a new type declaration in Java. But, before we move ahead let me make it very clear that records are not something that has been introduced to address problems like boilerplate, properties class or annotation-driven code generation, etc. Instead, it has been designed with a more thoughtful goal of representing _data as data_

> Remember, records are still a preview feature and you'll have to use the `--enable-preview` flag (explained below) when compiling/executing the programs from this post. You will also need [JDK 14](https://jdk.java.net/14/).

```shell
javac --release 14 --enable-preview Example.java
```

```shell
java --enable-preview Example
```

## Create a record

Here is a record in its simplest form.

```java
// Point.java
record point(int x, int y){};
```

Yes, that's it. Yes, it's Java. Yes, pure Java. No, no libraries, annotations or frameworks.

A record has a name (`Point` in this case), state description which declares the components (`(int x, int y)`) and an optional body (notice `{}`).

Now, let's see what Java generates for you after you compile your code.

```java
// decompiled Point.class
final class Point extends java.lang.Record {
    private final int x;
    private final int y;

    public Point(int x, int y) { /* compiled code */ }

    public java.lang.String toString() { /* compiled code */ }

    public final int hashCode() { /* compiled code */ }

    public final boolean equals(java.lang.Object o) { /* compiled code */ }

    public int x() { /* compiled code */ }

    public int y() { /* compiled code */ }
}
```

A lot of things are pretty evident from the code above

1. records are implicitly immutable.
2. a public all args constructor with signature same as the state description
3. public getters
4. implementation of hashCode & equals
5. implementation of toString

Superb! right?

## How to use records?

records enjoy all the benefits of a Java class with some restrictions (which we will see later on). That said, a record can be instantiated with the `new` keyword and the methods can be accessed like any other object's.

```java
// Application.java
public class Application {

    public static void main(String[] args) {

        Point point = new Point(2, 4);

        System.out.println("point = " + point.toString());
        System.out.println("point.x = " + point.x());
        System.out.println("point.y = " + point.y());
    }
}

// output
point = Point[x=2, y=4]
point.x = 2
point.y = 4
```

## Equality in records

As we saw earlier, a record implicitly generates `hashCode` and `equals` and if we go by this default implementation, then, two records are equal to each other when they're of the same type and contain the same state. An example will make it more clear

```java
// Application.java
public class Application {

    public static void main(String[] args) {

        Point point1 = new Point(1, 2);

        Point point2 = new Point(1, 2);

        System.out.println("point1.equals(point2) = " + point1.equals(point2));
    }
}

// output 
point1.equals(point2) = true
```

`point1` and `point2` are equal to each other for being of the same type (Point) and containing the same states (x = 1 & y = 2)

## Restrictions

records do have some restrictions as well

1. they cannot extend any other class

```java
record Point(int x, int y) extends SomeClass {}; // Error - not allowed
```

2. they cannot have explicit instance variables other than the private final fields which are the part of components of the state description

```java
record Point(int x, int y) extends SomeClass {
    private final int z; // Error - not allowed
    private int z; // Error - not allowed
}; 
```

## Features

Apart from the restrictions above, records do behave like normal classes

1. they can have static fields, methods, initializers

```java
// Point.java
record Point(int x, int y) {
    
    public static final double PI = 3.14; // allowed
    
    // allowed
    public static double getPI() {
        
        return PI;
    }
    
    // allowed
    static {
        
        System.out.println("Printed in a static initializer");
    }
};
```

2. they can have instance methods

```java
// Point.java
record Point(int x, int y) {
    
    // allowed
    public int add() {
        
        return x + y;
    }
};
```

3. they can have explicit canonical constructors without a formal parameter list. This allows performing validations & normalizations

```java
// Point.java
record Point(int x, int y) {

    // allowed
    public Point {

        if (x < y) {
            
            throw new IllegalArgumentException("x cannot be less than y");
        }
    }
};
```

4. Yes, they can be generic too

```java
// Point.java
record Point<T>(T x, T y) {};

// Application.java
public class Application {

    public static void main(String[] args) {

        Point<String> point = new Point<>("A", "B");
    }
}
```

## Final thoughts

_records_ being so less verbose and concise while still enjoying a normal class's features are a great addition to Java. Developers will surely find it beneficial at various places and will be able to move very quickly when representing data in their code.