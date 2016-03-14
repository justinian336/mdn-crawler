// Analiza routes.json generado por mdn-crawler, presentando algunos conteos
// Dominio público de acuerdo a la legislación colombiana. 2016. vtamara@pasosdeJesus.org

if (process.argv.length != 3) {
  console.log("Primer parámetro debe ser ruta del archivo routes.json")
  process.exit(1)
}

var path = require('path')
var ruta = path.resolve(process.argv[2])
var r = require(ruta)
if (r.length < 100) {
  console.log("Primer parámetro debe ser ruta al archivo routes.json generado por mdn-crawler")
  process.exit(1)
}
var i,ing = 0, esp = 0, msg = 0;
var tmsg = []
for(i = 0; i < r.length; i++) {
  if (r[i].enUrl != '') {
    ing++;
  }
  if (r[i].esUrl == '') {
    esp++;
  }
  if (r[i].esMessage != '') {
    msg++;
    if (typeof tmsg[r[i].esMessage] == 'undefined') {
      tmsg[r[i].esMessage] = 1;
    } else {
      tmsg[r[i].esMessage]++;
    }
  }
}

console.log("Número de rutas: ", r.length, "  (100%)");
console.log("Número de rutas con enUrl: ", ing, " (", 
    Math.round(ing*100/r.length), "%)");
console.log("Número de rutas con esUrl: ", esp, " (", 
    Math.round(esp*100/r.length), "%)");
console.log("Número de rutas con esMessage: ", msg, " (", 
    Math.round(msg*100/r.length), "%)");
console.log("Mensajes posibles: ", tmsg);

