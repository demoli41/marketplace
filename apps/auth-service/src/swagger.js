import { version } from "os";
import swaggerAutogen from "swagger-autogen";

const doc={
    info: {
        title: 'Auth Service API', 
        description: 'API documentation for the authentication service',
        version:"1.0.0",
    },
    host: 'localhost:6001',
    schemes:['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles=["./routes/auth.router.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);