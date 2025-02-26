import bidder from './bidder';
import tender from './tender'
let objects = {
	bidder: bidder,
	tender:tender
};

export function getObject(name) {
	return objects[name];
}

export default objects;
