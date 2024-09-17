grammar Roll;

roll : NUMBER? 'd' NUMBER ('+' NUMBER)? ;

NUMBER : [0-9]+ ;

WHITESPACE : ' \r\n\t' -> skip;