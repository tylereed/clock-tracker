grammar Roll;

roll: count? 'd' sides modifier?;

count: NUMBER;

sides: NUMBER;

modifier: ('+' | '-') NUMBER;

NUMBER: [0-9]+;

WHITESPACE: [ \r\n\t]+ -> skip;