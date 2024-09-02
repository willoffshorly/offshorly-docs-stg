# Printing in Java

Java provides several ways to output text and data to the console or other output streams. This document covers the most common methods for printing in Java, including `System.out.println()`, `System.out.print()`, and `System.out.printf()`, as well as more advanced techniques using `PrintStream` and `PrintWriter`.

## Basic Printing

The `System.out.println()` method prints a line of text to the console and adds a newline character at the end.

```java
System.out.println("Hello, World!");
```

To print without a newline, use `System.out.print()`:

```java
System.out.print("Hello, ");
System.out.print("World!");
```

## Printing Variables

You can print variables by including them in the print statement:

```java
String name = "Alice";
int age = 30;
System.out.println("Name: " + name + ", Age: " + age);
```

## Formatted Printing

For more control over the output format, use `System.out.printf()`:

```java
String name = "Bob";
double salary = 50000.75;
System.out.printf("Name: %s, Salary: $%.2f%n", name, salary);
```

Common format specifiers:

- `%s`: String
- `%d`: Integer
- `%f`: Float/Double
- `%n`: Newline

## PrintStream and PrintWriter

For more advanced printing options, you can use `PrintStream` or `PrintWriter`:

```java
import java.io.PrintStream;

PrintStream ps = new PrintStream(System.out);
ps.println("This is printed using PrintStream");
```

## Printing to Files

To print to a file, you can use `PrintWriter`:

```java
import java.io.PrintWriter;
import java.io.FileWriter;
import java.io.IOException;

try (PrintWriter writer = new PrintWriter(new FileWriter("output.txt"))) {
    writer.println("This text is written to a file.");
} catch (IOException e) {
    e.printStackTrace();
}
```

Remember to handle exceptions when working with file I/O.
