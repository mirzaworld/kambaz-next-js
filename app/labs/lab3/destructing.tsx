"use client";

export default function Destructing() {
  const person = { name : "John", age : 25 };
  const { name, age } = person;

  const numbers = [ "one", "two", "three" ];
  const [ first, second, third ] = numbers;

  return (
    <div id = "wd-destructing">
      <h2> Destructing </h2>

      <h3> Object Destructing </h3>
      <code>
        const &#123; name, age &#125; = &#123; name : &quot;John&quot;, age : 25 &#125;
      </code>
      <br /> <br />
      name = { name } <br />
      age = { age }

      <h3> Array Destructing </h3>
      <code>
        const [ first, second, third ] = [ &quot;one&quot;, &quot;two&quot;, &quot;three&quot; ]
      </code>
      <br /> <br />
      first = { first } <br />
      second = { second } <br />
      third = { third } <hr />
    </div>
  );
}
