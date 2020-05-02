---
title: Streams - a real-life approach
description: Let's understand Streams with a real-life example
date: 2020-05-02
---

<article class="post-title">
  <header>
    <h1 class="font-bold text-gray-900 text-3xl">
      {{ title }}
    </h1>
    <span class="font-light text-sm text-gray-600">
      {{ page.date | toUTCString | date: "%b %d, %Y" }} - 
    </span>
    <span class="font-light text-sm text-gray-600">
      {{site.author.name}}
    </span>
  </header>
</article>

Streams were first introduced with Java 8 in 2014. So, they're around 5 years old now. However, many of us still struggle to understand & explain Streams properly. For some, it is just a new way to loop through a list while some think it just reduces the amount of code that we need to write. Although these statements are not incorrect they highly understate the power of Streams. Today we will learn Streams with a couple of things that you all can find in your kitchen i.e a tap, some water, a water purifier, and a glass. I hope you're in your kitchen (with whatever you're reading this post on of course).

## Stream is data flowing towards you

Turn that tap on and the water starts flowing. People, you have a stream and that water is your data. Streams are all about data being pushed to you. Instead of you going to the data (like pulling out water in a bucket from a well) the data itself comes to you. To keep a track of things technically, we will also work with a Stream of Strings which will represent our water stream in code.

```java
// a stream of string to represent our water stream with some impurities in it.
Stream<String> water = Stream.of("water", "water", "water", "impurity", "impurity", "water"); // water, water, water, impurity, impurity, water
```

## Filtering - the _filter_ operation

Water from the tap is not considered good to be consumed directly because of impurities just like sometimes we don't want something to be a part of our data. And, here is when a filter (something like a water purifier) comes in to remove anything that we don't want.

```java
Stream<String> water = Stream.of("water", "water", "water", "impurity", "impurity", "water"); // water, water, water, impurity, impurity, water

// let's filter out impurities
Stream<String> pureWater = water.filter(w -> !w.equals("impurity")); // water, water, water, water
```

## Mapping - the _map_ operation

We are delicate beings and removing impurities from water is just not enough for us. We also need the water to be injected with RO & other minerals, right? In real life generally, our water purifiers do all these things but for the sake of our example here we will take it as a different operation, a `map` operation.

```java
Stream<String> water = Stream.of("water", "water", "water", "impurity", "impurity", "water");

Stream<String> pureWater = water.filter(w -> !w.equals("impurity")); // water, water, water, water

// let's add some ro & minerals
Stream<String> roWater = pureWater.map(w -> "ro" + w); // rowater, rowater, rowater, rowater
```

> A very important thing to keep in mind here is that `map` is a `1 to 1` operation. A `1 to 1` operation means one input produces one output. For eg: here every single `water` is being converted to a single `rowater`

## Flatmapping - the _flatMap_ operation

What happens when you pass water through a sprinkler? Yes, it's broken down into droplets. And, that's exactly what a `flatMap` does to your data.

> Unlike the `map` it is a `1 to many` operation i.e it produces multiple outputs for a single input.

```java
Stream<String> water = Stream.of("water", "water", "water", "impurity", "impurity", "water");

Stream<String> pureWater = water.filter(w -> !w.equals("impurity")); // water, water, water, water

Stream<Character> droplets = pureWater.flatMap(w -> w.chars().mapToObj(d -> (char) d)); // waterwaterwaterwater
```

## Streams are implicitly _lazy_

Now, think about it. Would you turn that tap on, that water purifier on or that sprinkler on, unless & until you need water to store, to cook or to drink? No, right. It does not make sense to do this whole process if you do not have a concrete purpose. That's exactly what Java thinks and thus it chose to keep the Streams lazy. All the code that you see above would do nothing unless you have a specific purpose, something that we call a `terminal` operation.

## A _Terminal_ operation is what makes the Streams go

In our whole kitchen, tap, water scenario what do you think would be the terminal operation? Collecting the water to a glass (remember, I mentioned that you would need a glass as well). So, unless you want a glass of water you wouldn't turn on anything.

> Unlike `map`, `flatMap` & `filter` there is no operation named `terminal`. However, various operations like `collect`, `forEach` etc. are considered to be terminal operations.

```java
Stream<String> water = Stream.of("water", "water", "water", "impurity", "impurity", "water");

Stream<String> pureWater = water.filter(w -> !w.equals("impurity")); // water, water, water, water

Stream<String> roWater = pureWater.map(w -> "ro" + w); // rowater, rowater, rowater, rowater

List<String> glassOfWater = roWater.collect(Collectors.toList()); // a terminal operation which will kick off all the Streams above
```

In the code above, the Streams `water`, `pureWater` & `roWater` will be executed only when the line

```java
List<String> glassOfWater = roWater.collect(Collectors.toList()); // list of rowater, rowater, rowater, rowater
```

gets executed because that's our terminal operation, that's our concrete purpose to even have all those streams in the first place.

## Of course, you can have all that code chained

Doing something like below is absolutely fine and even recommended. After all, your kitchen also has things attached as well, right.

```java
List<String> glassOfWater = Stream
        .of("water", "water", "water", "impurity", "impurity",
            "water") // water, water, water, impurity, impurity, water
        .filter(w -> !w.equals("impurity")) // water, water, water, water
        .map(w -> "ro" + w) // rowater, rowater, rowater, rowater
        .collect(Collectors.toList()); // list of rowater, rowater, rowater, rowater
```

## Conclusion

Now, that's what Streams are in all their glory. They are a lot more powerful than you think and I hope after this post you'll appreciate Streams more than just considering them as a new iterator or boilerplate remover.
