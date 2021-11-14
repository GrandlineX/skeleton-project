import * as Path from 'path';
import  {
  createFolderIfNotExist,
  sleep
} from "@grandlinex/kernel";
 import {randomUUID} from "crypto";
import SkeletonKernel from "../src/SkeletonKernel";
import axios from "axios";

const msiPath = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');
 process.env.DLOG_LEVEL = 'debug';

function testKernelUtil(port: number) {
   const kernel=  new SkeletonKernel();
   kernel.setAppServerPort(port)
  return kernel;
}


 createFolderIfNotExist(msiPath);
 createFolderIfNotExist(testPath);


let port = 9900;
let kernel = testKernelUtil(port);

let store=kernel.getConfigStore();
const testText = 'hello_world';

describe('Clean Startup', () => {
  let jwtToken:any;
  test('definePreload', async () => {
    expect(kernel.getState()).toBe('init');
    expect(kernel.getModCount()).toBe(1);

  });
  test('start kernel', async () => {
    const result = await kernel.start();
    expect(result).toBe(true);
    expect(kernel.getModCount()).toBe(1);
    expect(kernel.getState()).toBe('running');
  });



  test('get api token', async () => {
    const cc = kernel.getCryptoClient();
    expect(cc).not.toBeNull();

    const token = await axios.post<{token:string}>(`http://localhost:${port}/token`,{
      username: "admin",
      token:store.get("SERVER_PASSWORD"),
    });
    expect(token.status).toBe(200);
    const json = token.data
    expect(json.token).not.toBeNull();
    expect(json.token).not.toBeUndefined();
    jwtToken=json.token;
    const res = await cc?.jwtVerifyAccessToken(json.token);
    expect(await cc?.permissonValidation(jwtToken,"api")).toBeTruthy()
    expect(res?.username).toBe("admin");

  });


  test("test api auth fail",async ()=>{
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow',
    };

    try {
      const testcall = await axios.get<any>(
          `http://localhost:${port}/test/auth`,
      );
      expect(testcall.status).toBe(401);

    }catch (error:any){
      expect(error.response.status).toBe(401);
    }

  });



  test("test auth ",async ()=>{

    const testcall = await axios.get(
        `http://localhost:${port}/test/auth`,
        {
          headers:{
            Authorization:`bearer ${jwtToken}`
          }
        }
    );
    expect(testcall.status).toBe(200);
  });


  test("user list",async ()=>{

    const testcall = await axios.get(
        `http://localhost:${port}/user/list`,
        {
          headers:{
            Authorization:`bearer ${jwtToken}`
          }
        }
    );
    expect(testcall.status).toBe(200);
  });


  test("user add",async ()=>{

    const testcall = await axios.post(
        `http://localhost:${port}/user/add`,{
          username:randomUUID(),
          password:randomUUID()
        },
        {
          headers:{
            Authorization:`bearer ${jwtToken}`
          }
        }
    );
    expect(testcall.status).toBe(200);
  });


  test('exit kernel', async () => {
    const result = await kernel.stop();

    await sleep(1000);

    expect(kernel.getState()).toBe('exited');

    expect(result).toBeTruthy();
  });
});

