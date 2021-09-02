import fetch, { RequestInit } from 'node-fetch';

import { config } from 'dotenv';
import * as Path from 'path';
import Kernel, {
  createFolderIfNotExist,
  sleep
} from "@grandlinex/kernel";
import {AuthModule} from "../src";
import {randomUUID} from "crypto";
config();

const appName = 'TestKernel';
const appCode = 'tkernel';
const msiPath = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');
 process.env.DLOG_LEVEL = 'debug';

function testKernelUtil(port: number) {
   return  new Kernel(appName, appCode, testPath, port);
}


 createFolderIfNotExist(msiPath);
 createFolderIfNotExist(testPath);


let port = 9900;
let kernel = testKernelUtil(port);

const testText = 'hello_world';

describe('Clean Startup', () => {
  let jwtToken:any;
  test('definePreload', async () => {
    expect(kernel.getState()).toBe('init');
    expect(kernel.getModuleList()).toHaveLength(0);
    kernel.setTrigerFunction("pre",async (ik)=>{
      ik.addModule(new AuthModule(ik))
    })
  });
  test('start kernel', async () => {
    const result = await kernel.start();
    expect(result).toBe(true);
    expect(kernel.getModuleList()).toHaveLength(1);
    expect(kernel.getState()).toBe('running');
  });



  test('get api token', async () => {
    const cc = kernel.getCryptoClient();
    expect(cc).not.toBeNull();
    const body: string = JSON.stringify({
      username: "admin",
      token: process.env.SERVER_PASSWOR,
    });
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
      redirect: 'follow',
      body,
    };
    const token = await fetch(`http://localhost:${port}/token`, requestOptions);
    expect(token.status).toBe(200);
    const text = await token.text();
    const json = JSON.parse(text);
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

    const testcall = await fetch(
        `http://localhost:${port}/test/auth`,
        requestOptions
    );
    expect(testcall.status).toBe(401);
  });



  test("test auth ",async ()=>{
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: [['Authorization', `bearer ${jwtToken}`]],
      redirect: 'follow',
    };
    const testcall = await fetch(
        `http://localhost:${port}/test/auth`,
        requestOptions
    );
    expect(testcall.status).toBe(200);
  });


  test("user list",async ()=>{
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: [['Authorization', `bearer ${jwtToken}`]],
      redirect: 'follow',
    };
    const testcall = await fetch(
        `http://localhost:${port}/user/list`,
        requestOptions
    );
    expect(testcall.status).toBe(200);
  });


  test("user add",async ()=>{
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: [['Authorization', `bearer ${jwtToken}`],["Content-Type","application/json"]],
      redirect: 'follow',
      body:JSON.stringify({
        username:randomUUID(),
        password:randomUUID()
      })
    };
    const testcall = await fetch(
        `http://localhost:${port}/user/add`,
        requestOptions
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

