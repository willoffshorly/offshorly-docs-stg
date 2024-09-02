# Printing in Java

Java provides several ways to output text and data to the console or other output streams. This guide covers the most common methods for printing in Java.

## Using System.out.println()

The most common way to print in Java is using `System.out.println()`. This method prints the specified content and adds a new line at the end.

```java
System.out.println("Hello, World!");
```

## Using System.out.print()

If you don't want a new line after the output, use `System.out.print()`:

```java
System.out.print("Hello, ");
System.out.print("World!");
```

## Printing Formatted Strings

For more complex output formatting, use `System.out.printf()` or `String.format()`:

```java
String name = "Alice";
int age = 30;
System.out.printf("Name: %s, Age: %d%n", name, age);

String formatted = String.format("Name: %s, Age: %d", name, age);
System.out.println(formatted);
```

## Printing Variables

You can print variables by including them in your print statements:

```java
int number = 42;
String text = "Answer";
System.out.println(text + ": " + number);
```

## Printing Arrays

To print arrays, you can use `Arrays.toString()` method:

```java
import java.util.Arrays;

int[] numbers = {1, 2, 3, 4, 5};
System.out.println(Arrays.toString(numbers));
```

## Printing to Files

To print to a file, you can use `PrintWriter`:

```java
import java.io.PrintWriter;
import java.io.FileWriter;
import java.io.IOException;

try (PrintWriter writer = new PrintWriter(new FileWriter("output.txt"))) {
    writer.println("This is a line of text");
    writer.printf("Formatted output: %d%n", 42);
} catch (IOException e) {
    e.printStackTrace();
}
```

Remember to handle exceptions when working with file I/O.
