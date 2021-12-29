import * as Path from 'path';
import  {
  createFolderIfNotExist,
  sleep
} from "@grandlinex/kernel";
import axios from "axios";
import SkeletonKernel from "../src";

const msiPath = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');

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
    if (res){
        expect(await cc?.permissonValidation(res,"admin")).toBeTruthy()
        expect(res?.username).toBe("admin");
    }else {
        expect(true).toBeFalsy()
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
        `http://localhost:${port}/example/list`,
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

