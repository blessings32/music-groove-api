export default (temp, product) => {
     let output = temp.replace(/{%IDNO%}/g, product.id)
     output = output.replace(/{%STUDENTNAME%}/g, product.studentName)
     output = output.replace(/{%MATH%}/g, product.math)
     output = output.replace(/{%ENGLISH%}/g, product.english)
     output = output.replace(/{%CHEM%}/g, product.chem)
     output = output.replace(/{%BIOLOGY%}/g, product.biology)
     output = output.replace(/{%PHYSICS%}/g, product.physics)

     output = output.replace(/{%POSITION%}/g, product.position);
     output = output.replace(/{%POINTS%}/g, product.points);
     output = output.replace(/{%BEHAVIOUR%}/g, product.behaviour);
     output = output.replace(/{%BALANCE%}/g, product.balance);

     return output
}