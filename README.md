Correção do erro "Please type another input file name: "

```sh
sed -i 's/\r$//' compile.sh
```