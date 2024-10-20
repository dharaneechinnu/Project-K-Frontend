import axios from 'axios';

export default axios.create({
  baseURL: 'http://68.233.99.191:5000', // Update to your Oracle VM IP and port
});
