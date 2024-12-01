export const miniPrograms = {
	Javascript : [
		{
			id: 1,
			lines: [
				"function greeting(name) {",
				"return 'Hello, ' + name + '!';",
				'console.log(greeting("World"));',
			],
		},
		{
			id: 2,
			lines: [
				"function add(a, b) {",
				"return a + b;",
				'console.log(add(1, 2));',
			],
		},
		{
			id: 3,
			lines: [
				"function subtract(a, b) {",
				"return a - b;",
				'console.log(subtract(5, 3));',
			],
		},
		{
			id: 4,
			lines: [
				"function loop() {",
				"for (let i = 0; i < 5; i++) {",
				"console.log(i);",
			],
		},
	],
	Python : [
		{
			id: 1,
			lines: [
				"def greeting(name):",
				"return 'Hello, ' + name + '!'",
				"print(greeting('World'))",
			],
		},
		{
			id: 2,
			lines: [
				"def multiply(a, b):",
				"return a * b",
				'print(multiply(2, 3))',
			],
		},
		{
			id: 3,
			lines: [
				"def divide(a, b):",
				"return a / b",
				'print(divide(10, 2))',
			],
		},
		{
			id: 4,
			lines : [
				"def while_loop():",
				"i = 0",
				"while i < 5:",
				"print(i)",
				"i += 1",
			],	
		},
	],
	Java: [
		{
			id: 1,
			lines: [
				"public class Main {",
				"public static void main (String[] args) {",
				"System.out.println('Hello, World!');",
			],
		},
		{
			id: 2, 
			lines: [
				"public class Main {",
				"public static void main (String[] args) {",
				"Scanner scanner = new Scanner(System.in);",
				"System.out.println('Enter your name: ');",
				"String name = scanner.nextLine();",
				"char[] nameArray = name.toCharArray();",
				"int nameLength = nameArray.length;",
				"for(int i = nameLength; i > 0; i--) {",
				"System.out.println(nameArray[i-1]);",
			],
		},
		{
			id: 3,
			lines: [
				"public class Main {",
				"public static void main (String[] args) {",
				"int num1 = 5;",
				"int num2 = 10;",
				"if(num1 < num2) {",
				"System.out.println(num1 + ' is less than ' + num2);",
			],
		},
		{
			id: 4,
			lines: [
				"public class Factorial {",
                "public static void main(String[] args) {",
                "int number = 5;",
                "int factorial = 1;",
                "for (int i = 1; i <= number; i++) {",
                "factorial *= i;",
                "System.out.println(factorial);",
			],
		},
	],
	CSharp: [
		{
			id: 1,
			lines: [
				"using System;",
				"class Program {",
				"static void Main(string[] args) {",
				"Console.WriteLine('Hello, World!');",
			],
		},
		{
			id: 2,
			lines: [
				"using System;",
				"class EvenOrOdd {",
				"static void Main(string[] args) {",
				"Console.WriteLine('Enter a number: ');",
				"int num = int.Parse(Console.ReadLine());",
				"if(num % 2 == 0) {",
				"Console.WriteLine(num + ' is even');",
				"} else {",
				"Console.WriteLine(num + ' is odd');",
			],
		},
		{
			id: 3,
			lines: [
				"using System;",
				"class BasicArray {",
				"static void Main(string[] args) {",
				"int[] numbers = {1, 2, 3, 4, 5};",
				"foreach(int number in numbers) {",
				"Console.WriteLine(number);",
			],
		},
	],
}