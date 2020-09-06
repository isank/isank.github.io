---
title: HTTP Clients with Feign
description: How about delivering your APIs along with their HTTP client?
date: 2020-09-06
---

We deliver a lot of APIs now and then. And, undoubtedly we're adding/improving every single day. But, what if we could also make an API consumer's life easier, lessen code duplicity and deliver an HTTP client without making a mess? Well, [Feign](https://github.com/OpenFeign/feign) makes all this possible. So, let's get going and explore what Feign has to offer.

## What is Feign?

Feign is a Java to HTTP client binder. It takes away the complexity of writing a Java client for your REST/SOAP services. Also, it allows you to write your code over various other HTTP clients such as OK Http, java.net.URL, Apache HTTP, etc. And, Feign makes it super easy to retry the requests in case of failures.

## Okay, let's code

We will create two ridiculously simple Gradle projects. The first project (User) comprises two modules a Spring Boot based service that exposes two REST APIs and a Feign based HTTP client for our service module. The second project (User Service Consumer) will just act as a consumer of the service using our client module. All the code used in this post can be found [here](https://github.com/isank/openfeign-demo)

### User Project

It's going to be a [Gradle Composite Build](https://docs.gradle.org/current/userguide/composite_builds.html). 

```groovy
// settings.gradle

rootProject.name = 'user'

includeBuild 'client'
includeBuild 'service'
```

```groovy
// build.gradle

group = 'demo.openfeign.user'

task publishToMavenLocal {
    dependsOn gradle.includedBuilds*.task(':publishToMavenLocal')
}

task clean {
    dependsOn gradle.includedBuilds*.task(':clean')
}

task bootRun {
    dependsOn gradle.includedBuild('service').task(':bootRun')
}
```

#### User Service module

Our user service is a Spring Boot based application that exposes two REST APIs.

```groovy
// settings.gradle

rootProject.name = 'service'
```

```groovy
// build.gradle

plugins {
    id 'org.springframework.boot' version '2.3.3.RELEASE'
    id 'io.spring.dependency-management' version '1.0.10.RELEASE'
    id 'java'
    id 'maven-publish'
}

group = 'demo.openfeign.user'
version = '0.0.1-SNAPSHOT'

sourceCompatibility = '11'
targetCompatibility = '11'

repositories {
    mavenCentral()
}

dependencies {
    implementation(
            ['org.springframework.boot:spring-boot-starter-web'],
            ['demo.openfeign.user:client:0.0.1-SNAPSHOT']
    )

    testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
    }
}

test {
    useJUnitPlatform()
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            artifact bootJar
        }
    }
}
```

Notice, we also added a dependency on our `client` module with `demo.openfeign.user:client:0.0.1-SNAPSHOT`. Why? we will get to it in a minute. But, first, let's create our controller.

```java
// don't do this in production code

package demo.openfeign.user.service.controller;

import demo.openfeign.user.client.dto.User;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class UserController {

  private final Map<UUID, User> users = new ConcurrentHashMap<>();

  @PostMapping("user")
  public User addUser(@RequestBody User incomingUserRequest) {

    UUID userId = UUID.randomUUID();

    User user = new User();
    user.setId(userId);
    user.setName(incomingUserRequest.getName());
    user.setAddress(incomingUserRequest.getAddress());

    users.put(userId, user);

    return user;
  }

  @GetMapping("user/{id}")
  public User getUser(@PathVariable("id") String id) {

    return users.get(UUID.fromString(id));
  }
}
```

As you can see, that's a very simple controller with only two responsibilities

* Create a user, assign a random id to it, put it into a map, and return the newly created user object. And, 
* Return a user based on an incoming id.

> Also, notice that class `User` is not a part of the service module instead it's from our client module. This was the reason to include `demo.openfeign.user:client:0.0.1-SNAPSHOT` in our `build.gradle`

#### User Client module

And, here comes the fun part. Let's design our Feign based HTTP client module for our user service.

```groovy
// settings.gradle

rootProject.name = 'client'
```

```groovy
// build.gradle

plugins {
    id 'java-library'
    id 'maven-publish'
}

group = 'demo.openfeign.user'
version = '0.0.1-SNAPSHOT'

sourceCompatibility = '11'
targetCompatibility = '11'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'io.github.openfeign:feign-jackson:11.0'

    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.6.2'

    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.6.2'
}

test {
    useJUnitPlatform()
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
        }
    }
}
```

Let's define `User` dto that serves as a request/response for our REST APIs

```java
package demo.openfeign.user.client.dto;

import java.util.UUID;

public class User {

  private UUID id;

  private String name;

  private String address;

  // no-args constructor

  // getters/setters

  // override toString
}
```

Creating a Feign client starts with defining an interface like

```java
package demo.openfeign.user.client.user;

import demo.openfeign.user.client.dto.User;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

@Headers("Content-Type: application/json")
public interface UserService {

  @RequestLine("POST /user")
  User addUser(User user);

  @RequestLine("GET /user/{id}")
  User getUser(@Param("id") String id);
}
```

Let's breakdown this interface and see what's going on

1. `@Headers`, as the name suggests, represents all the headers that you want to send with your request. `@Headers` can be applied to a type/method.
2. `@RequestLine` comprises of HTTP method and the end-point to hit.

Finally, we will create a factory class that will give us an instance to an HTTP client 

```java
package demo.openfeign.user.client.user;

import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;

public class UserServiceFactory {

  public static UserService create(String targetUrl) {

    return Feign.builder().encoder(new JacksonEncoder()).decoder(new JacksonDecoder())
        .target(UserService.class, targetUrl);
  }
}
```

The static `create` method takes a String `targetUrl` as a parameter which can be something like `http://localhost:8080` or `https://www.example.com`. Next, we use Feign's fluent builder which takes in an encoder, decoder, and target type and target url to create our HTTP client. Here, we're using Jackson's encoder and decoder

> Feign supports a lot of encoders and decoders like Jackson, Gson, Sax, JAXB

Before we move ahead, let's run our service module by executing

```bash
./gradlew bootRun
```

from the root directory. This will start the service module on `http://localhost:8080`

### Finally, let's put things to test with User Service Consumer project

```groovy
// settings.gradle

rootProject.name = 'user-service-consumer'
```

```groovy

// build.gradle

plugins {
    id 'java'
    id 'application'
}

repositories {
    mavenCentral()
    mavenLocal()
}

dependencies {
    implementation 'demo.openfeign.user:client:0.0.1-SNAPSHOT'

    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.6.2'

    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.6.2'
}

application {
    mainClassName = 'user.service.consumer.App'
}

test {
    useJUnitPlatform()
}
```

> Notice, we added a dependency on our `demo.openfeign.user:client:0.0.1-SNAPSHOT` which is ultimately our client module

```java
package user.service.consumer;

import demo.openfeign.user.client.dto.User;
import demo.openfeign.user.client.user.UserService;
import demo.openfeign.user.client.user.UserServiceFactory;

public class App {

  private static final String USER_SERVICE_HOST = "http://localhost:8080";

  public static void main(String[] args) {

    UserService userService = UserServiceFactory.create(USER_SERVICE_HOST);

    User newUser = new User();
    newUser.setName("John");
    newUser.setAddress("World");

    User addedUser = userService.addUser(newUser);
    // Created new user = User{id=5040efa6-5e6e-4d75-af30-30a82b6081d1, name='John', address='World'}

    System.out.println("Created new user = " + addedUser);

    User user = userService.getUser(addedUser.getId().toString());

    System.out.println("User = " + user);
    // User = User{id=5040efa6-5e6e-4d75-af30-30a82b6081d1, name='John', address='World'}
  }
}
```

First, we get an instance to our HTTP client using `UserServiceFactory` which is actually an instance of `UserService` from our client module. And, then it becomes just as easy as calling a method on a class to make a network call over HTTP. See,

```java
User addedUser = userService.addUser(newUser);
```

So, that's it, we created our HTTP client using Feign and put it to use. But, let me tell you that Feign is not just limited to what we did in this post. You can configure it in a lot of ways. For eg: you can use a different HTTP client, another encoder/decoder with it, and a lot more.  

## Benefits of using Feign

Now that we know how it works. Let's explore why it makes sense to use it.

1. Less duplication - imagine working on a Microservices based solution. There's a great possibility that a service like our [user service](#user-service-module) will be consumed by a lot of other services and having a Feign based HTTP client would save every consumer from creating/duplicating request/response classes. 

2. Consistency - consumers won't need to deal with the implementation of an HTTP client to consume the APIs. It will be as easy as adding a dependency, create an instance, and get going.

3. More control to API developers - API developers can easily change the APIs and update the client as well which results in compatible artifacts and provides seamless developer experience.

4. Official support from Spring - Spring brings a lot of goodness to Feign with [Spring Cloud Feign](https://cloud.spring.io/spring-cloud-openfeign/reference/html/)

## Limitations 

1. Feign supports text-based APIs only.

2. There is still no support for a reactive execution. So, you won't find support for [Project Reactor](https://projectreactor.io/) or [RxJava](https://github.com/ReactiveX/RxJava). But, it is already planned and we will soon have that as well.

## Conclusion

I think Feign can help development teams a lot when it comes to consuming each other's APIs because once you get it right it will end up making development faster. Although, it adds a little bit of more work on the API developer's side but its worth it.

## References

* [Source Repository](https://github.com/isank/openfeign-demo)

* [Feign's official repository](https://github.com/OpenFeign/feign)