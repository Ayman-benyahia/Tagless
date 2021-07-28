# Tagless
Tagless is javascript library that interpret costume <br>
HTML syntax (HTML syntax without tags) into normal HTML.

# Tagless Syntax 
```
div (class:'card') 
  div (class:'card-head') 
    img (class:'card-img' src:'./landscape.jpg') /img
    h4 (class:'card-header') 'Lorem ipsum dolor' /h4
  /div
  div (class:'card-body') 
    p (class:'card-message') 
      'Lorem ipsum dolor sit emet'
    /p
  /div
/div
```

Compiled into:

> <div  class="card"> 
>   <div  class="card-head"> 
>     <img  class="card-img" src="./landscape.jpg"> </img>
>     <h4  class="card-header"> "Lorem ipsum dolor" </h4>
>   </div>
>   <div  class="card-body"> 
>     <p  class="card-message"> 
>       "Lorem ipsum dolor sit emet"
>     </p>
>   </div>
> </div>

# Tagless syntax features
The syntax is organizable, see valide possibilities below:

> div (class:'classname') 'lorem ipsum dolor' /div
> div ( class : 'classname' ) 'lorem ipsum dolor' /div
> div (  class  :  'classname'  ) 'lorem ipsum dolor' /div
> div () 'lorem ipsum dolor' /div
> div ( ) 'lorem ipsum dolor' /div

> div ( 
>   class : 'classname' 
>   id    : 'identifier'
> ) 
> 'lorem ipsum dolor' 
> /div

> div 
> ( 
>   class : 'classname' 
>   id    : 'identifier'
> ) 
> 'lorem ipsum dolor' 
> /div

> div ( class : 'classname' id : 'identifier' ) 
>   'lorem ipsum dolor' 
> /div

# How to use
> let code = `
> div ( 
>   class:'classname' 
>   id:'identifier' 
> ) 
>   'Lorem ipsum dolor sit emet.' 
>   a (href:'#') 'Lorem ipsum' /a 
> /div`
> 
> let html = compile(code);
> document.body.innerHTML += html;

*Note: 
Tagless syntax error missing token is sometimes inaccurate!<br>*

*Note: 
Error is thrown because of:
- attribute name includes something other than '-', '_', alphabets, digits.
- element name includes something other than '-', '_', alphabets, digits.
- missing token(special syntax character) like for example `(`, `)`, `:`, `'`, '/'
- forgetting to escape `'` inside string for example 'lorem ' ipsum'
you should escape 'lorem @' ipsum'.*


# Tagless BFN grammar 
> <element>        := <space> <open-tag>  <space> '(' <space> <attr> <space> ')' <space> <inner> <space> <close-tag> <space> <inner> | 
>                     <space> '!--' <space> <text> <space> '--' <space> <inner>                                                                     | 
>                     <space> <inner>
> <open-tag>       := <letter> <name> 
> <close-tag>      := '/' <letter> <name>
> <attr>           := <attr-name> ':' `'` <text> `'` ' ' <space> <attr> | 
>                     <attr-name> ':' `'` <text> `'`
> <attr-name>      := <letter> <name>
> <inner>          := `'` <text> `'` <space> <inner> |
>                     <element> <inner> 
> <text>           := Anything but `'` you have to escape it using `@`
> <name>           := <letter>           | 
>                     <digit>            | 
>                     '-'                | 
>                     '_'                | 
>                     <letter>   <name>  | 
>                     <digit>    <name>  | 
>                     '-'        <name>  | 
>                     '_'        <name>  
> <letter>         := a | b | c | d | e | f | g | h | i | j | k | l | m | n | o | p | q | r | s | t | u | v | w | x | y | z |
>                     A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z |
                      Other langs alphabet...
> <digit>          := 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
> <speciale>       := ! # $ % & " ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
> <space>          := ' '  <space> | 
>                     '\n' <space> | 
>                     ' '          | 
>                     \n

  


  
  
  
  
  
  
  
  
  
  
