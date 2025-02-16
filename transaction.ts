//节点URL  REST API地址
export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
//水龙头URL
export const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

//生成账号接口
import { AptosAccount, TxnBuilderTypes, BCS, MaybeHexString } from "aptos";

//Aptos客户端 水龙头客户端
import { AptosClient, FaucetClient } from "aptos";

//创建节点客户端
const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);


//Helper方法返回与帐户关联的硬币余额
export async function accountBalance(accountAddress: MaybeHexString): Promise<number | null> {
  const resource = await client.getAccountResource(accountAddress, "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
  if (resource == null) {
    return null;
  }

  return parseInt((resource.data as any)["coin"]["value"]);
}

/**
 * 将给定的硬币金额从给定的帐户从转移到收件人的帐户地址。
 */
async function transfer(accountFrom: AptosAccount, recipient: MaybeHexString, amount: number): Promise<string> {
  //类型标记结构
  const token = new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"));

  //事务负载脚本函数
  const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
    TxnBuilderTypes.EntryFunction.natural(
      "0x1::coin",
      "transfer",
      [token],
      [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(recipient)), BCS.bcsSerializeUint64(amount)],
    ),
  );

  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(accountFrom.address()),
    client.getChainId(),
  ]);

  //原始事务处理
  const rawTxn = new TxnBuilderTypes.RawTransaction(
    TxnBuilderTypes.AccountAddress.fromHex(accountFrom.address()),
    BigInt(sequenceNumber),
    entryFunctionPayload,
    1000n,
    1n,
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new TxnBuilderTypes.ChainId(chainId),
  );

  //生成BCS事务
  const bcsTxn = AptosClient.generateBCSTransaction(accountFrom, rawTxn);
  //提交已签名的BCS事务
  const pendingTxn = await client.submitSignedBCSTransaction(bcsTxn);

  return pendingTxn.hash;
}


async function main() {
  //创建两个账户，A和B，并为A而不是B提供资金
  const a = new AptosAccount();
  const b = new AptosAccount();
  
  console.log("\n=== 地址 ===");
  console.log(
    `A: ${a.address()} Key: ${Buffer.from(a.signingKey.secretKey).toString("hex").slice(0, 64)}`,
  );
  console.log(`B: ${b.address()} Key: ${Buffer.from(b.signingKey.secretKey).toString("hex").slice(0, 64)}`);

  //水龙头领取代币
  await faucetClient.fundAccount(a.address(), 20000);
  await faucetClient.fundAccount(b.address(), 0);

  console.log("\n=== 初始余额 ===");
  console.log(`A: ${await accountBalance(a.address())}`);
  console.log(`B: ${await accountBalance(b.address())}`);

  // A 转账给 B 1000个硬币
  const txHash = await transfer(a, b.address(), 1000);
  await client.waitForTransaction(txHash);

  console.log("Txn Hash:", txHash);

  console.log("\n=== 账户余额 ===");
  console.log(`A: ${await accountBalance(a.address())}`);
  console.log(`B: ${await accountBalance(b.address())}`);

}

if (require.main === module) {
  main();
}
