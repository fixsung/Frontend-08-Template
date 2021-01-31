<!--
 * @Author: songyzh
 * @Date: 2021-01-31 21:51:35
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-31 21:52:10
-->

<Number> ::= "0" | "1" | "2" |……| "9"
<DecimalNumber> ::= "0" | (("1" | "2" | ...... | "9")<Number>\*)

<PrimaryExpression> ::= <DecimalNumber> |
"(" <LogicalExpression> ")"

<MultipcativeExpression> ::=<PrimaryExpression> |
<MultipcativeExpression> "\*" <PrimaryExpression>|
<MultipcativeExpression> "/" <PrimaryExpression>

<AditiveExpression> ::= <MultiplicativeExpression> |
<AditiveExpression> "+" <MultiplicativeExpression> |
<AditiveExpression> "-" <MultiplicativeExpression>

<LogicalExpression> ::= <AdditionExpression> |
<LogicalExpression> "||" <AdditionExpression> |
<LogicalExpression> "&&" <AdditionExpression>
