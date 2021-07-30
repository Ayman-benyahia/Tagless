# Tagless
Tagless is javascript library that interpret costume HTML syntax (HTML syntax without tags)<br> into normal HTML and it's 
only 12KB unminified and 5KB minified so you dont have to worry about bundle size.<br>
##### Don't forget to give it a star

### Tagless Syntax 
Tagless syntax is very clean minimal and easy <br> to navigate visually and faster to write.
```
nav (
    class:'
      navbar 
      navbar-expand-lg 
      navbar-light bg-light'
  )
  div ( class:'container-fluid' )
    a ( class:'navbar-brand' href:'#' ) 
      'Navbar Brand' 
    /a
    button (
          class          : 'navbar-toggler' type                   : 'button' 
          data-bs-toggle : 'collapse' data-bs-target               : '#navbarSupportedContent' 
          aria-controls  : 'navbarSupportedContent' aria-expanded  : 'false'
          aria-label     : 'Toggle navigation'
      )   span ( class:'navbar-toggler-icon' ) /span
    /button
    div ( 
        class:'collapse navbar-collapse' 
        id   :'navbarSupportedContent' 
      ) 
      ul ( 
          class:'navbar-nav me-auto 
                mb-2 mb-lg-0' 
        ) 
        li ( class:'nav-item' )
          a ( class:'nav-link active' 
            aria-current:'page' href:'#' ) 'Home' /a
        /li
        li ( class:'nav-item' )
          a ( class:'nav-link' href:'#' ) 
            'Features' 
          /a
        /li
        li ( class:'nav-item' )
          a ( class:'nav-link' href:'#' ) 
            'About' 
          /a
        /li
        li ( class:'nav-item' )
          a ( class:'nav-link' href:'#' ) 
            'Contact' 
          /a
        /li
      /ul
    /div
  /div
/nav
```

### Tagless syntax features
- Tagless have syntax validator
- Faster to write & easy to read 
- Easy to use. 

### How to use
Download tagless.js and include it normally.
```
 <script src="./tagless.js"></script>
```
Tagless is easy to use just call compile function, see code below.
```
let markup = `
div ( class:'classname' id:'identifier' ) 
    'Lorem ipsum dolor sit emet.' 
    a (href:'#') 'Lorem ipsum' /a 
/div`

let html = compile(markup);
document.body.innerHTML += html;
```

> **Note:**
> Tagless syntax error missing token is sometimes inaccurate!

> **Note:**<br>
> Syntax error is thrown because of:<br>
> - attribute name includes something other than `-`, `_`, alphabets, digits.<br>
> - element name includes something other than `-`, `_`, alphabets, digits.<br>
> - missing token(special syntax character) like for example `(`, `)`, `:`, `'`, `/`<br>
> - forgetting to escape `'` inside string for example `'lorem ' ipsum'`<br>
> you should escape using `@`, for example `'lorem @' ipsum'`


### Tagless BFN grammar 
```
<element>        := <space> <open-tag>  <space> '(' <space> <attr> <space> ')' <space> <inner> <space> <close-tag> <space> <inner> | 
                    <space> '!--' <space> <text> <space> '--' <space> <inner>                                                                     | 
                    <space> <inner>
<open-tag>       := <letter> <name> 
<close-tag>      := '/' <letter> <name>
<attr>           := <attr-name> ':' `'` <text> `'` ' ' <space> <attr> | 
                    <attr-name> ':' `'` <text> `'`
<attr-name>      := <letter> <name>
<inner>          := `'` <text> `'` <space> <inner> |
                    <element> <inner> 
<text>           := Anything but `'` you have to escape it using `@`
<name>           := <letter>           | 
                    <digit>            | 
                    '-'                | 
                    '_'                | 
                    <letter>   <name>  | 
                    <digit>    <name>  | 
                    '-'        <name>  | 
                    '_'        <name>  
<letter>         := a | b | c | d | e | f | g | h | i | j | k | l | m | n | o | p | q | r | s | t | u | v | w | x | y | z |
                    A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z |
                      Other langs alphabet...
<digit>          := 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
<speciale>       := ! # $ % & " ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
<space>          := ' '  <space> | 
                    '\n' <space> | 
                    ' '          | 
                    \n
```
 


  
  
  
  
  
  
  
  
  
  
