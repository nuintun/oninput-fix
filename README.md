oninput-fix
=========

>Fix input event in jquery, support low version of ie.

###Introduction:
Default is CommonJS module

If not CommonJS you must do this:

>1.Remove first and last line of the code

>2.Wrap code useing:
```js
(function ($){
  // the code of remove first and last line
}(jQuery));
```

###API:
Sample:
>
```js
$('#input').on('input', callback);
$('#input').input(callback);
$('#input').off('input', callback);
$('#input').uninput(callback);
```
