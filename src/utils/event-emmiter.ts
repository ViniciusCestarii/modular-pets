import EventEmitter from "events";

class AppEventEmitter extends EventEmitter {}
const eventBus = new AppEventEmitter();

export default eventBus;
