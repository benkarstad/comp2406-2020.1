/**
 * @function Calculates the total of the submitted order(s)
 * @return {null}
 *
 * @param {Object} items - order stats of a restaurant
 * 		{
 *			<item name>: <qty ordered>,
 *			...
 *		}
 * @param {Object} restaurant - a restaurant object
 * @param {number} orderCount - number of orders (to multiply the delivery fee)
 *
 * */
function calcTotal(items, restaurant, orderCount){
	let	total = 0;
	for(let itemName in items){ //for all ordered items...
		for(let i in restaurant.menu){ //find it's price and add that to the total
			let itemObj = restaurant.menu[i];
			if(itemObj.name === itemName){
				total += itemObj.price*items[itemName];
				break
			}
		}
	}
	total *= 1.1;
	total += restaurant.delivery_fee*orderCount;
	return total;
}

module.exports = {
	calcTotal
};