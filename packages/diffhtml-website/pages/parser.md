# Parser

The parser built into diffHTML supports loose and strict HTML, XML, and SVG. It
includes a token based syntax that can be used to interpolate dynamic values.
This is used by the [html](/api.html#html) function/tagged template and can be
leveraged to integrate template engines.

The parser can read full HTML documents including doctype, html/head/body/title
etc tags, unwrapped fragments, and more!

```js
import { html } from 'diffhtml';

console.log(html`
  <div>Hello world</div>
`);
```

<a name="dynamic-values"></a>

---

## <a href="#dynamic-values">Dynamic values</a>

The parser allows you to use dynamic values for many different parts of the
HTML syntax.

```
<TAG ATTR ATTR_NAME=ATTR_VALUE>CHILD</TAG>
```


<a name="strict-mode"></a>

---

## <a href="#strict-mode">Strict mode</a>

By default the parser operates in loose-mode which is forgiving of missing
closing tags, poor markup, and other common issues. When opting into strict
mode you will receive errors if you don't properly self close tags, or have
mismatched tag names. It will also error if you passing invalid values.


<a name="block-elements"></a>

---

## <a href="#block-elements">Customize block elements</a>

<a name="self-closing"></a>

---

## <a href="#self-closing">Customize self closing elements</a>
