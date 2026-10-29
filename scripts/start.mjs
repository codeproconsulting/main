import path from 'node:path';
import {pathToFileURL} from 'node:url';
import express from 'express';
import {createRequestHandler} from '@react-router/express';
// Existing PM2 variables take precedence over .env.
try { process.loadEnvFile('.env'); } catch(error) { if(error.code!=='ENOENT')throw error; }
const build=await import(pathToFileURL(path.resolve('build/server/index.js')).href);
const app=express();
app.disable('x-powered-by');
// Only the local VPS edge may supply the external HTTPS scheme/hostname.
app.set('trust proxy','loopback');
app.use((request,response,next)=>{
 response.setHeader('X-Content-Type-Options','nosniff');
 if(request.path.startsWith('/admin')){
  response.setHeader('Cache-Control','private, no-store');
  response.setHeader('X-Robots-Tag','noindex, nofollow');
  response.setHeader('Referrer-Policy','same-origin');
  response.setHeader('X-Frame-Options','DENY');
 }
 next();
});
app.use('/assets',express.static('build/client/assets',{immutable:true,maxAge:'1y'}));
app.use(express.static('build/client',{maxAge:'1h'}));
app.all('*',createRequestHandler({build,mode:process.env.NODE_ENV}));
const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||3000);
const server=app.listen(port,host,()=>console.log(`ProConsulting ${process.env.APP_SURFACE||'website'} listening at http://${host}:${port}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref();});
