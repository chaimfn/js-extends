# js-extends
* Extends for some js types.
* 'Type' enum.

## Extends:

### Date:
* equals(date)
```
let d1 = new Date("2000-01-01"),    
let d2 = new Date(2000, 0, 1);
d1.equals(d2); // true
```


### Array:
* notNullItems()
```
let o1 = {a: 1, b: null, c: "str"};
let o2 = o.notNullItems(); // {a: 1, c: "str"}
```
* toString()
* sortBoolean()
```
let arr = [null, true, false, true, undefined, false];
let arr2 = arr.sortBoolean(); // [null, null, false, false, true, true]
```
* equals(arr)
```
let a1 = [1, "s", true, {a:1, b:() => {return 15}}];
let a2 = [1, "s", true, {a:1, b:() => {return 15}}];
let a3 = [1, "s", true, {a:1, b:() => {return 16}}];
a1.equals(a2); // true
a1.equals(a3); // false
```
* contains(item)
```
let arr = [1, "s", true, {a:1, b:() => {return 15}}];
let o = {a:1, b:() => {return 15}};
arr.contains(o); // true. (while 'arr.includes(o)' is false)
```

### Object:
* notNullItems()
```
let a1 = [1, "s", null, true, {a:1,}];
let a2 = a1.notNullItems(); // [1, "s", true, {a:1,}];
```
* isAnyNullOrUndefined(props)
```
let o = {prop_a: 1, prop_b: null, prop_c: "str"};
o.isAnyNullOrUndefined(); // true
o.isAnyNullOrUndefined(["prop_a", "prop_c"]); // false
o.isAnyNullOrUndefined(["prop_a", "prop_d"]); // true
```
* toString()
* equals(obj)
```
let o1 = {a:1, b: "str", c: true, d: (p) => {return p * p}};
let o2 = {a:1, b: "str", c: true, d: (p) => {return p * p}};
let o2 = {a:1, b: "str", c: true, d: (p) => {return p + p}};
o1.equals(o2); // true
o1.equals(o3); // false
```

### Function
* body()
```
// Returns the function's body
```
* shortString()
```
// Returns func.toString() without newlines and spaces.
```
* equals(func)
```
function f1(a) { return a + a; }
function f2(a) { 
    return a + a;
}
f1.equals(f2); // true;
```

## 'Type' Enum:
```
let t1 = Type.GetType(new Date()); // Type.Date (while 'typeof new Date()' is "object")
t1 == Type.Date; // true
let t2 = Type.GetType([]); // Type.Array (while 'typeof []' is "object")
t2 == Type.Array; // true
// Supported: Type.Undefine, Type.Number, Type.String, Type.Boolean, Type.Array, Type.Date, Type.Function, Type.Object.
```
