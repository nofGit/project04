
export function totalPrice (products){
    let total;
    for( let i = 0; i<products.length; i++ ){
    if( i ===0 ){
      total = products[i].total
    }
    else{
      total = total + products[i].total;
    }
  }
  return total
}