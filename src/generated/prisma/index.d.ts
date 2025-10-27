
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Vendor
 * 
 */
export type Vendor = $Result.DefaultSelection<Prisma.$VendorPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model Address
 * 
 */
export type Address = $Result.DefaultSelection<Prisma.$AddressPayload>
/**
 * Model LRRequest
 * 
 */
export type LRRequest = $Result.DefaultSelection<Prisma.$LRRequestPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model InvoiceReference
 * 
 */
export type InvoiceReference = $Result.DefaultSelection<Prisma.$InvoiceReferencePayload>
/**
 * Model InvoiceItem
 * 
 */
export type InvoiceItem = $Result.DefaultSelection<Prisma.$InvoiceItemPayload>
/**
 * Model PurchaseOrder
 * 
 */
export type PurchaseOrder = $Result.DefaultSelection<Prisma.$PurchaseOrderPayload>
/**
 * Model PurchaseOrderItem
 * 
 */
export type PurchaseOrderItem = $Result.DefaultSelection<Prisma.$PurchaseOrderItemPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model LorryReceipt
 * 
 */
export type LorryReceipt = $Result.DefaultSelection<Prisma.$LorryReceiptPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vendor`: Exposes CRUD operations for the **Vendor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vendors
    * const vendors = await prisma.vendor.findMany()
    * ```
    */
  get vendor(): Prisma.VendorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.address`: Exposes CRUD operations for the **Address** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Addresses
    * const addresses = await prisma.address.findMany()
    * ```
    */
  get address(): Prisma.AddressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lRRequest`: Exposes CRUD operations for the **LRRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LRRequests
    * const lRRequests = await prisma.lRRequest.findMany()
    * ```
    */
  get lRRequest(): Prisma.LRRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoiceReference`: Exposes CRUD operations for the **InvoiceReference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceReferences
    * const invoiceReferences = await prisma.invoiceReference.findMany()
    * ```
    */
  get invoiceReference(): Prisma.InvoiceReferenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoiceItem`: Exposes CRUD operations for the **InvoiceItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceItems
    * const invoiceItems = await prisma.invoiceItem.findMany()
    * ```
    */
  get invoiceItem(): Prisma.InvoiceItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseOrder`: Exposes CRUD operations for the **PurchaseOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseOrders
    * const purchaseOrders = await prisma.purchaseOrder.findMany()
    * ```
    */
  get purchaseOrder(): Prisma.PurchaseOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseOrderItem`: Exposes CRUD operations for the **PurchaseOrderItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseOrderItems
    * const purchaseOrderItems = await prisma.purchaseOrderItem.findMany()
    * ```
    */
  get purchaseOrderItem(): Prisma.PurchaseOrderItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lorryReceipt`: Exposes CRUD operations for the **LorryReceipt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LorryReceipts
    * const lorryReceipts = await prisma.lorryReceipt.findMany()
    * ```
    */
  get lorryReceipt(): Prisma.LorryReceiptDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Vendor: 'Vendor',
    Document: 'Document',
    Address: 'Address',
    LRRequest: 'LRRequest',
    Invoice: 'Invoice',
    InvoiceReference: 'InvoiceReference',
    InvoiceItem: 'InvoiceItem',
    PurchaseOrder: 'PurchaseOrder',
    PurchaseOrderItem: 'PurchaseOrderItem',
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    LorryReceipt: 'LorryReceipt'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "vendor" | "document" | "address" | "lRRequest" | "invoice" | "invoiceReference" | "invoiceItem" | "purchaseOrder" | "purchaseOrderItem" | "session" | "account" | "verification" | "lorryReceipt"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Vendor: {
        payload: Prisma.$VendorPayload<ExtArgs>
        fields: Prisma.VendorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findFirst: {
            args: Prisma.VendorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findMany: {
            args: Prisma.VendorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          create: {
            args: Prisma.VendorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          createMany: {
            args: Prisma.VendorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.VendorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          update: {
            args: Prisma.VendorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          deleteMany: {
            args: Prisma.VendorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VendorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          aggregate: {
            args: Prisma.VendorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendor>
          }
          groupBy: {
            args: Prisma.VendorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorCountArgs<ExtArgs>
            result: $Utils.Optional<VendorCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      Address: {
        payload: Prisma.$AddressPayload<ExtArgs>
        fields: Prisma.AddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findFirst: {
            args: Prisma.AddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findMany: {
            args: Prisma.AddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          create: {
            args: Prisma.AddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          createMany: {
            args: Prisma.AddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          update: {
            args: Prisma.AddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          deleteMany: {
            args: Prisma.AddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          aggregate: {
            args: Prisma.AddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAddress>
          }
          groupBy: {
            args: Prisma.AddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<AddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.AddressCountArgs<ExtArgs>
            result: $Utils.Optional<AddressCountAggregateOutputType> | number
          }
        }
      }
      LRRequest: {
        payload: Prisma.$LRRequestPayload<ExtArgs>
        fields: Prisma.LRRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LRRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LRRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload>
          }
          findFirst: {
            args: Prisma.LRRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LRRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload>
          }
          findMany: {
            args: Prisma.LRRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload>[]
          }
          create: {
            args: Prisma.LRRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload>
          }
          createMany: {
            args: Prisma.LRRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LRRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload>
          }
          update: {
            args: Prisma.LRRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload>
          }
          deleteMany: {
            args: Prisma.LRRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LRRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LRRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LRRequestPayload>
          }
          aggregate: {
            args: Prisma.LRRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLRRequest>
          }
          groupBy: {
            args: Prisma.LRRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<LRRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.LRRequestCountArgs<ExtArgs>
            result: $Utils.Optional<LRRequestCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      InvoiceReference: {
        payload: Prisma.$InvoiceReferencePayload<ExtArgs>
        fields: Prisma.InvoiceReferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceReferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceReferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload>
          }
          findFirst: {
            args: Prisma.InvoiceReferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceReferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload>
          }
          findMany: {
            args: Prisma.InvoiceReferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload>[]
          }
          create: {
            args: Prisma.InvoiceReferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload>
          }
          createMany: {
            args: Prisma.InvoiceReferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InvoiceReferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload>
          }
          update: {
            args: Prisma.InvoiceReferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceReferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceReferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceReferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceReferencePayload>
          }
          aggregate: {
            args: Prisma.InvoiceReferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceReference>
          }
          groupBy: {
            args: Prisma.InvoiceReferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceReferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceReferenceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceReferenceCountAggregateOutputType> | number
          }
        }
      }
      InvoiceItem: {
        payload: Prisma.$InvoiceItemPayload<ExtArgs>
        fields: Prisma.InvoiceItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          findFirst: {
            args: Prisma.InvoiceItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          findMany: {
            args: Prisma.InvoiceItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>[]
          }
          create: {
            args: Prisma.InvoiceItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          createMany: {
            args: Prisma.InvoiceItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InvoiceItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          update: {
            args: Prisma.InvoiceItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          deleteMany: {
            args: Prisma.InvoiceItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceItemPayload>
          }
          aggregate: {
            args: Prisma.InvoiceItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceItem>
          }
          groupBy: {
            args: Prisma.InvoiceItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceItemCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceItemCountAggregateOutputType> | number
          }
        }
      }
      PurchaseOrder: {
        payload: Prisma.$PurchaseOrderPayload<ExtArgs>
        fields: Prisma.PurchaseOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          findFirst: {
            args: Prisma.PurchaseOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          findMany: {
            args: Prisma.PurchaseOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>[]
          }
          create: {
            args: Prisma.PurchaseOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          createMany: {
            args: Prisma.PurchaseOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PurchaseOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          update: {
            args: Prisma.PurchaseOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          aggregate: {
            args: Prisma.PurchaseOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseOrder>
          }
          groupBy: {
            args: Prisma.PurchaseOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseOrderCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderCountAggregateOutputType> | number
          }
        }
      }
      PurchaseOrderItem: {
        payload: Prisma.$PurchaseOrderItemPayload<ExtArgs>
        fields: Prisma.PurchaseOrderItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseOrderItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseOrderItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          findFirst: {
            args: Prisma.PurchaseOrderItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseOrderItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          findMany: {
            args: Prisma.PurchaseOrderItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>[]
          }
          create: {
            args: Prisma.PurchaseOrderItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          createMany: {
            args: Prisma.PurchaseOrderItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PurchaseOrderItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          update: {
            args: Prisma.PurchaseOrderItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseOrderItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseOrderItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseOrderItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          aggregate: {
            args: Prisma.PurchaseOrderItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseOrderItem>
          }
          groupBy: {
            args: Prisma.PurchaseOrderItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseOrderItemCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderItemCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      LorryReceipt: {
        payload: Prisma.$LorryReceiptPayload<ExtArgs>
        fields: Prisma.LorryReceiptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LorryReceiptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LorryReceiptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload>
          }
          findFirst: {
            args: Prisma.LorryReceiptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LorryReceiptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload>
          }
          findMany: {
            args: Prisma.LorryReceiptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload>[]
          }
          create: {
            args: Prisma.LorryReceiptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload>
          }
          createMany: {
            args: Prisma.LorryReceiptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LorryReceiptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload>
          }
          update: {
            args: Prisma.LorryReceiptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload>
          }
          deleteMany: {
            args: Prisma.LorryReceiptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LorryReceiptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LorryReceiptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LorryReceiptPayload>
          }
          aggregate: {
            args: Prisma.LorryReceiptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLorryReceipt>
          }
          groupBy: {
            args: Prisma.LorryReceiptGroupByArgs<ExtArgs>
            result: $Utils.Optional<LorryReceiptGroupByOutputType>[]
          }
          count: {
            args: Prisma.LorryReceiptCountArgs<ExtArgs>
            result: $Utils.Optional<LorryReceiptCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    vendor?: VendorOmit
    document?: DocumentOmit
    address?: AddressOmit
    lRRequest?: LRRequestOmit
    invoice?: InvoiceOmit
    invoiceReference?: InvoiceReferenceOmit
    invoiceItem?: InvoiceItemOmit
    purchaseOrder?: PurchaseOrderOmit
    purchaseOrderItem?: PurchaseOrderItemOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    lorryReceipt?: LorryReceiptOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    accounts: number
    PurchaseOrder: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    PurchaseOrder?: boolean | UserCountOutputTypeCountPurchaseOrderArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPurchaseOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderWhereInput
  }


  /**
   * Count Type VendorCountOutputType
   */

  export type VendorCountOutputType = {
    users: number
    invoices: number
    PurchaseOrder: number
    Address: number
    LRRequest: number
  }

  export type VendorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | VendorCountOutputTypeCountUsersArgs
    invoices?: boolean | VendorCountOutputTypeCountInvoicesArgs
    PurchaseOrder?: boolean | VendorCountOutputTypeCountPurchaseOrderArgs
    Address?: boolean | VendorCountOutputTypeCountAddressArgs
    LRRequest?: boolean | VendorCountOutputTypeCountLRRequestArgs
  }

  // Custom InputTypes
  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorCountOutputType
     */
    select?: VendorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountPurchaseOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderWhereInput
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountAddressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountLRRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LRRequestWhereInput
  }


  /**
   * Count Type InvoiceCountOutputType
   */

  export type InvoiceCountOutputType = {
    items: number
    LRRequest: number
    InvoiceReference: number
  }

  export type InvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | InvoiceCountOutputTypeCountItemsArgs
    LRRequest?: boolean | InvoiceCountOutputTypeCountLRRequestArgs
    InvoiceReference?: boolean | InvoiceCountOutputTypeCountInvoiceReferenceArgs
  }

  // Custom InputTypes
  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceCountOutputType
     */
    select?: InvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceItemWhereInput
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountLRRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LRRequestWhereInput
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountInvoiceReferenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceReferenceWhereInput
  }


  /**
   * Count Type PurchaseOrderCountOutputType
   */

  export type PurchaseOrderCountOutputType = {
    items: number
    invoices: number
  }

  export type PurchaseOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | PurchaseOrderCountOutputTypeCountItemsArgs
    invoices?: boolean | PurchaseOrderCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * PurchaseOrderCountOutputType without action
   */
  export type PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderCountOutputType
     */
    select?: PurchaseOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PurchaseOrderCountOutputType without action
   */
  export type PurchaseOrderCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderItemWhereInput
  }

  /**
   * PurchaseOrderCountOutputType without action
   */
  export type PurchaseOrderCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    phone: string | null
    companyId: string | null
    vendorId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    phone: string | null
    companyId: string | null
    vendorId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    email: number
    emailVerified: number
    image: number
    role: number
    banned: number
    banReason: number
    banExpires: number
    phone: number
    companyId: number
    vendorId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    phone?: true
    companyId?: true
    vendorId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    phone?: true
    companyId?: true
    vendorId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    phone?: true
    companyId?: true
    vendorId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    role: string
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    phone: string | null
    companyId: string | null
    vendorId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    phone?: boolean
    companyId?: boolean
    vendorId?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    Vendor?: boolean | User$VendorArgs<ExtArgs>
    PurchaseOrder?: boolean | User$PurchaseOrderArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    phone?: boolean
    companyId?: boolean
    vendorId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "email" | "emailVerified" | "image" | "role" | "banned" | "banReason" | "banExpires" | "phone" | "companyId" | "vendorId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    Vendor?: boolean | User$VendorArgs<ExtArgs>
    PurchaseOrder?: boolean | User$PurchaseOrderArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      Vendor: Prisma.$VendorPayload<ExtArgs> | null
      PurchaseOrder: Prisma.$PurchaseOrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      name: string
      email: string
      emailVerified: boolean
      image: string | null
      role: string
      banned: boolean | null
      banReason: string | null
      banExpires: Date | null
      phone: string | null
      companyId: string | null
      vendorId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Vendor<T extends User$VendorArgs<ExtArgs> = {}>(args?: Subset<T, User$VendorArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    PurchaseOrder<T extends User$PurchaseOrderArgs<ExtArgs> = {}>(args?: Subset<T, User$PurchaseOrderArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly banned: FieldRef<"User", 'Boolean'>
    readonly banReason: FieldRef<"User", 'String'>
    readonly banExpires: FieldRef<"User", 'DateTime'>
    readonly phone: FieldRef<"User", 'String'>
    readonly companyId: FieldRef<"User", 'String'>
    readonly vendorId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.Vendor
   */
  export type User$VendorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    where?: VendorWhereInput
  }

  /**
   * User.PurchaseOrder
   */
  export type User$PurchaseOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    where?: PurchaseOrderWhereInput
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    cursor?: PurchaseOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Vendor
   */

  export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  export type VendorMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    name: string | null
    contactEmail: string | null
    contactPhone: string | null
    gstNumber: string | null
    panNumber: string | null
    profileCompleted: boolean | null
    taxId: string | null
    paymentTerms: string | null
    isActive: boolean | null
  }

  export type VendorMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    name: string | null
    contactEmail: string | null
    contactPhone: string | null
    gstNumber: string | null
    panNumber: string | null
    profileCompleted: boolean | null
    taxId: string | null
    paymentTerms: string | null
    isActive: boolean | null
  }

  export type VendorCountAggregateOutputType = {
    id: number
    createdAt: number
    name: number
    contactEmail: number
    contactPhone: number
    gstNumber: number
    panNumber: number
    profileCompleted: number
    taxId: number
    paymentTerms: number
    isActive: number
    _all: number
  }


  export type VendorMinAggregateInputType = {
    id?: true
    createdAt?: true
    name?: true
    contactEmail?: true
    contactPhone?: true
    gstNumber?: true
    panNumber?: true
    profileCompleted?: true
    taxId?: true
    paymentTerms?: true
    isActive?: true
  }

  export type VendorMaxAggregateInputType = {
    id?: true
    createdAt?: true
    name?: true
    contactEmail?: true
    contactPhone?: true
    gstNumber?: true
    panNumber?: true
    profileCompleted?: true
    taxId?: true
    paymentTerms?: true
    isActive?: true
  }

  export type VendorCountAggregateInputType = {
    id?: true
    createdAt?: true
    name?: true
    contactEmail?: true
    contactPhone?: true
    gstNumber?: true
    panNumber?: true
    profileCompleted?: true
    taxId?: true
    paymentTerms?: true
    isActive?: true
    _all?: true
  }

  export type VendorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendor to aggregate.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vendors
    **/
    _count?: true | VendorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorMaxAggregateInputType
  }

  export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
        [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor[P]>
      : GetScalarType<T[P], AggregateVendor[P]>
  }




  export type VendorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorWhereInput
    orderBy?: VendorOrderByWithAggregationInput | VendorOrderByWithAggregationInput[]
    by: VendorScalarFieldEnum[] | VendorScalarFieldEnum
    having?: VendorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorCountAggregateInputType | true
    _min?: VendorMinAggregateInputType
    _max?: VendorMaxAggregateInputType
  }

  export type VendorGroupByOutputType = {
    id: string
    createdAt: Date
    name: string
    contactEmail: string | null
    contactPhone: string | null
    gstNumber: string | null
    panNumber: string | null
    profileCompleted: boolean
    taxId: string | null
    paymentTerms: string | null
    isActive: boolean
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorGroupByOutputType[P]>
            : GetScalarType<T[P], VendorGroupByOutputType[P]>
        }
      >
    >


  export type VendorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    name?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    gstNumber?: boolean
    panNumber?: boolean
    profileCompleted?: boolean
    taxId?: boolean
    paymentTerms?: boolean
    isActive?: boolean
    users?: boolean | Vendor$usersArgs<ExtArgs>
    invoices?: boolean | Vendor$invoicesArgs<ExtArgs>
    PurchaseOrder?: boolean | Vendor$PurchaseOrderArgs<ExtArgs>
    Address?: boolean | Vendor$AddressArgs<ExtArgs>
    LRRequest?: boolean | Vendor$LRRequestArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor"]>



  export type VendorSelectScalar = {
    id?: boolean
    createdAt?: boolean
    name?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    gstNumber?: boolean
    panNumber?: boolean
    profileCompleted?: boolean
    taxId?: boolean
    paymentTerms?: boolean
    isActive?: boolean
  }

  export type VendorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "name" | "contactEmail" | "contactPhone" | "gstNumber" | "panNumber" | "profileCompleted" | "taxId" | "paymentTerms" | "isActive", ExtArgs["result"]["vendor"]>
  export type VendorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Vendor$usersArgs<ExtArgs>
    invoices?: boolean | Vendor$invoicesArgs<ExtArgs>
    PurchaseOrder?: boolean | Vendor$PurchaseOrderArgs<ExtArgs>
    Address?: boolean | Vendor$AddressArgs<ExtArgs>
    LRRequest?: boolean | Vendor$LRRequestArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $VendorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vendor"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      PurchaseOrder: Prisma.$PurchaseOrderPayload<ExtArgs>[]
      Address: Prisma.$AddressPayload<ExtArgs>[]
      LRRequest: Prisma.$LRRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      name: string
      contactEmail: string | null
      contactPhone: string | null
      gstNumber: string | null
      panNumber: string | null
      profileCompleted: boolean
      taxId: string | null
      paymentTerms: string | null
      isActive: boolean
    }, ExtArgs["result"]["vendor"]>
    composites: {}
  }

  type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = $Result.GetResult<Prisma.$VendorPayload, S>

  type VendorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VendorCountAggregateInputType | true
    }

  export interface VendorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vendor'], meta: { name: 'Vendor' } }
    /**
     * Find zero or one Vendor that matches the filter.
     * @param {VendorFindUniqueArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorFindUniqueArgs>(args: SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vendor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorFindUniqueOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorFindFirstArgs>(args?: SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendors
     * const vendors = await prisma.vendor.findMany()
     * 
     * // Get first 10 Vendors
     * const vendors = await prisma.vendor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorWithIdOnly = await prisma.vendor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorFindManyArgs>(args?: SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vendor.
     * @param {VendorCreateArgs} args - Arguments to create a Vendor.
     * @example
     * // Create one Vendor
     * const Vendor = await prisma.vendor.create({
     *   data: {
     *     // ... data to create a Vendor
     *   }
     * })
     * 
     */
    create<T extends VendorCreateArgs>(args: SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vendors.
     * @param {VendorCreateManyArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorCreateManyArgs>(args?: SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Vendor.
     * @param {VendorDeleteArgs} args - Arguments to delete one Vendor.
     * @example
     * // Delete one Vendor
     * const Vendor = await prisma.vendor.delete({
     *   where: {
     *     // ... filter to delete one Vendor
     *   }
     * })
     * 
     */
    delete<T extends VendorDeleteArgs>(args: SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vendor.
     * @param {VendorUpdateArgs} args - Arguments to update one Vendor.
     * @example
     * // Update one Vendor
     * const vendor = await prisma.vendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorUpdateArgs>(args: SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vendors.
     * @param {VendorDeleteManyArgs} args - Arguments to filter Vendors to delete.
     * @example
     * // Delete a few Vendors
     * const { count } = await prisma.vendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorDeleteManyArgs>(args?: SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorUpdateManyArgs>(args: SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Vendor.
     * @param {VendorUpsertArgs} args - Arguments to update or create a Vendor.
     * @example
     * // Update or create a Vendor
     * const vendor = await prisma.vendor.upsert({
     *   create: {
     *     // ... data to create a Vendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor we want to update
     *   }
     * })
     */
    upsert<T extends VendorUpsertArgs>(args: SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorCountArgs} args - Arguments to filter Vendors to count.
     * @example
     * // Count the number of Vendors
     * const count = await prisma.vendor.count({
     *   where: {
     *     // ... the filter for the Vendors we want to count
     *   }
     * })
    **/
    count<T extends VendorCountArgs>(
      args?: Subset<T, VendorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorAggregateArgs>(args: Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>

    /**
     * Group by Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorGroupByArgs['orderBy'] }
        : { orderBy?: VendorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vendor model
   */
  readonly fields: VendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Vendor$usersArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends Vendor$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    PurchaseOrder<T extends Vendor$PurchaseOrderArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$PurchaseOrderArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Address<T extends Vendor$AddressArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$AddressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    LRRequest<T extends Vendor$LRRequestArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$LRRequestArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vendor model
   */
  interface VendorFieldRefs {
    readonly id: FieldRef<"Vendor", 'String'>
    readonly createdAt: FieldRef<"Vendor", 'DateTime'>
    readonly name: FieldRef<"Vendor", 'String'>
    readonly contactEmail: FieldRef<"Vendor", 'String'>
    readonly contactPhone: FieldRef<"Vendor", 'String'>
    readonly gstNumber: FieldRef<"Vendor", 'String'>
    readonly panNumber: FieldRef<"Vendor", 'String'>
    readonly profileCompleted: FieldRef<"Vendor", 'Boolean'>
    readonly taxId: FieldRef<"Vendor", 'String'>
    readonly paymentTerms: FieldRef<"Vendor", 'String'>
    readonly isActive: FieldRef<"Vendor", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Vendor findUnique
   */
  export type VendorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findUniqueOrThrow
   */
  export type VendorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findFirst
   */
  export type VendorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findFirstOrThrow
   */
  export type VendorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findMany
   */
  export type VendorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendors to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor create
   */
  export type VendorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to create a Vendor.
     */
    data: XOR<VendorCreateInput, VendorUncheckedCreateInput>
  }

  /**
   * Vendor createMany
   */
  export type VendorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
  }

  /**
   * Vendor update
   */
  export type VendorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to update a Vendor.
     */
    data: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
    /**
     * Choose, which Vendor to update.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor updateMany
   */
  export type VendorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to update.
     */
    limit?: number
  }

  /**
   * Vendor upsert
   */
  export type VendorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The filter to search for the Vendor to update in case it exists.
     */
    where: VendorWhereUniqueInput
    /**
     * In case the Vendor found by the `where` argument doesn't exist, create a new Vendor with this data.
     */
    create: XOR<VendorCreateInput, VendorUncheckedCreateInput>
    /**
     * In case the Vendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
  }

  /**
   * Vendor delete
   */
  export type VendorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter which Vendor to delete.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor deleteMany
   */
  export type VendorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendors to delete
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to delete.
     */
    limit?: number
  }

  /**
   * Vendor.users
   */
  export type Vendor$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Vendor.invoices
   */
  export type Vendor$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Vendor.PurchaseOrder
   */
  export type Vendor$PurchaseOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    where?: PurchaseOrderWhereInput
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    cursor?: PurchaseOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * Vendor.Address
   */
  export type Vendor$AddressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    cursor?: AddressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Vendor.LRRequest
   */
  export type Vendor$LRRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    where?: LRRequestWhereInput
    orderBy?: LRRequestOrderByWithRelationInput | LRRequestOrderByWithRelationInput[]
    cursor?: LRRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LRRequestScalarFieldEnum | LRRequestScalarFieldEnum[]
  }

  /**
   * Vendor without action
   */
  export type VendorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    label: string | null
    url: string | null
    entryBy: string | null
    description: string | null
    linkedId: string | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    label: string | null
    url: string | null
    entryBy: string | null
    description: string | null
    linkedId: string | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    label: number
    url: number
    entryBy: number
    description: number
    linkedId: number
    _all: number
  }


  export type DocumentMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    label?: true
    url?: true
    entryBy?: true
    description?: true
    linkedId?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    label?: true
    url?: true
    entryBy?: true
    description?: true
    linkedId?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    label?: true
    url?: true
    entryBy?: true
    description?: true
    linkedId?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    label: string
    url: string | null
    entryBy: string | null
    description: string | null
    linkedId: string
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    label?: boolean
    url?: boolean
    entryBy?: boolean
    description?: boolean
    linkedId?: boolean
  }, ExtArgs["result"]["document"]>



  export type DocumentSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    label?: boolean
    url?: boolean
    entryBy?: boolean
    description?: boolean
    linkedId?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "label" | "url" | "entryBy" | "description" | "linkedId", ExtArgs["result"]["document"]>

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      label: string
      url: string | null
      entryBy: string | null
      description: string | null
      linkedId: string
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
    readonly label: FieldRef<"Document", 'String'>
    readonly url: FieldRef<"Document", 'String'>
    readonly entryBy: FieldRef<"Document", 'String'>
    readonly description: FieldRef<"Document", 'String'>
    readonly linkedId: FieldRef<"Document", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
  }


  /**
   * Model Address
   */

  export type AggregateAddress = {
    _count: AddressCountAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  export type AddressMinAggregateOutputType = {
    id: string | null
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    postal: string | null
    country: string | null
    vendorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AddressMaxAggregateOutputType = {
    id: string | null
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    postal: string | null
    country: string | null
    vendorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AddressCountAggregateOutputType = {
    id: number
    line1: number
    line2: number
    city: number
    state: number
    postal: number
    country: number
    vendorId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AddressMinAggregateInputType = {
    id?: true
    line1?: true
    line2?: true
    city?: true
    state?: true
    postal?: true
    country?: true
    vendorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AddressMaxAggregateInputType = {
    id?: true
    line1?: true
    line2?: true
    city?: true
    state?: true
    postal?: true
    country?: true
    vendorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AddressCountAggregateInputType = {
    id?: true
    line1?: true
    line2?: true
    city?: true
    state?: true
    postal?: true
    country?: true
    vendorId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Address to aggregate.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Addresses
    **/
    _count?: true | AddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AddressMaxAggregateInputType
  }

  export type GetAddressAggregateType<T extends AddressAggregateArgs> = {
        [P in keyof T & keyof AggregateAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAddress[P]>
      : GetScalarType<T[P], AggregateAddress[P]>
  }




  export type AddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithAggregationInput | AddressOrderByWithAggregationInput[]
    by: AddressScalarFieldEnum[] | AddressScalarFieldEnum
    having?: AddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AddressCountAggregateInputType | true
    _min?: AddressMinAggregateInputType
    _max?: AddressMaxAggregateInputType
  }

  export type AddressGroupByOutputType = {
    id: string
    line1: string
    line2: string | null
    city: string
    state: string | null
    postal: string | null
    country: string
    vendorId: string
    createdAt: Date
    updatedAt: Date
    _count: AddressCountAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  type GetAddressGroupByPayload<T extends AddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AddressGroupByOutputType[P]>
            : GetScalarType<T[P], AddressGroupByOutputType[P]>
        }
      >
    >


  export type AddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    line1?: boolean
    line2?: boolean
    city?: boolean
    state?: boolean
    postal?: boolean
    country?: boolean
    vendorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["address"]>



  export type AddressSelectScalar = {
    id?: boolean
    line1?: boolean
    line2?: boolean
    city?: boolean
    state?: boolean
    postal?: boolean
    country?: boolean
    vendorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AddressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "line1" | "line2" | "city" | "state" | "postal" | "country" | "vendorId" | "createdAt" | "updatedAt", ExtArgs["result"]["address"]>
  export type AddressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }

  export type $AddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Address"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      line1: string
      line2: string | null
      city: string
      state: string | null
      postal: string | null
      country: string
      vendorId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["address"]>
    composites: {}
  }

  type AddressGetPayload<S extends boolean | null | undefined | AddressDefaultArgs> = $Result.GetResult<Prisma.$AddressPayload, S>

  type AddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AddressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AddressCountAggregateInputType | true
    }

  export interface AddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Address'], meta: { name: 'Address' } }
    /**
     * Find zero or one Address that matches the filter.
     * @param {AddressFindUniqueArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AddressFindUniqueArgs>(args: SelectSubset<T, AddressFindUniqueArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Address that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AddressFindUniqueOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AddressFindUniqueOrThrowArgs>(args: SelectSubset<T, AddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AddressFindFirstArgs>(args?: SelectSubset<T, AddressFindFirstArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AddressFindFirstOrThrowArgs>(args?: SelectSubset<T, AddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Addresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Addresses
     * const addresses = await prisma.address.findMany()
     * 
     * // Get first 10 Addresses
     * const addresses = await prisma.address.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const addressWithIdOnly = await prisma.address.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AddressFindManyArgs>(args?: SelectSubset<T, AddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Address.
     * @param {AddressCreateArgs} args - Arguments to create a Address.
     * @example
     * // Create one Address
     * const Address = await prisma.address.create({
     *   data: {
     *     // ... data to create a Address
     *   }
     * })
     * 
     */
    create<T extends AddressCreateArgs>(args: SelectSubset<T, AddressCreateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Addresses.
     * @param {AddressCreateManyArgs} args - Arguments to create many Addresses.
     * @example
     * // Create many Addresses
     * const address = await prisma.address.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AddressCreateManyArgs>(args?: SelectSubset<T, AddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Address.
     * @param {AddressDeleteArgs} args - Arguments to delete one Address.
     * @example
     * // Delete one Address
     * const Address = await prisma.address.delete({
     *   where: {
     *     // ... filter to delete one Address
     *   }
     * })
     * 
     */
    delete<T extends AddressDeleteArgs>(args: SelectSubset<T, AddressDeleteArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Address.
     * @param {AddressUpdateArgs} args - Arguments to update one Address.
     * @example
     * // Update one Address
     * const address = await prisma.address.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AddressUpdateArgs>(args: SelectSubset<T, AddressUpdateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Addresses.
     * @param {AddressDeleteManyArgs} args - Arguments to filter Addresses to delete.
     * @example
     * // Delete a few Addresses
     * const { count } = await prisma.address.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AddressDeleteManyArgs>(args?: SelectSubset<T, AddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Addresses
     * const address = await prisma.address.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AddressUpdateManyArgs>(args: SelectSubset<T, AddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Address.
     * @param {AddressUpsertArgs} args - Arguments to update or create a Address.
     * @example
     * // Update or create a Address
     * const address = await prisma.address.upsert({
     *   create: {
     *     // ... data to create a Address
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Address we want to update
     *   }
     * })
     */
    upsert<T extends AddressUpsertArgs>(args: SelectSubset<T, AddressUpsertArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressCountArgs} args - Arguments to filter Addresses to count.
     * @example
     * // Count the number of Addresses
     * const count = await prisma.address.count({
     *   where: {
     *     // ... the filter for the Addresses we want to count
     *   }
     * })
    **/
    count<T extends AddressCountArgs>(
      args?: Subset<T, AddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AddressAggregateArgs>(args: Subset<T, AddressAggregateArgs>): Prisma.PrismaPromise<GetAddressAggregateType<T>>

    /**
     * Group by Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AddressGroupByArgs['orderBy'] }
        : { orderBy?: AddressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Address model
   */
  readonly fields: AddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Address.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Address model
   */
  interface AddressFieldRefs {
    readonly id: FieldRef<"Address", 'String'>
    readonly line1: FieldRef<"Address", 'String'>
    readonly line2: FieldRef<"Address", 'String'>
    readonly city: FieldRef<"Address", 'String'>
    readonly state: FieldRef<"Address", 'String'>
    readonly postal: FieldRef<"Address", 'String'>
    readonly country: FieldRef<"Address", 'String'>
    readonly vendorId: FieldRef<"Address", 'String'>
    readonly createdAt: FieldRef<"Address", 'DateTime'>
    readonly updatedAt: FieldRef<"Address", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Address findUnique
   */
  export type AddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findUniqueOrThrow
   */
  export type AddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findFirst
   */
  export type AddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findFirstOrThrow
   */
  export type AddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findMany
   */
  export type AddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Addresses to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address create
   */
  export type AddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to create a Address.
     */
    data: XOR<AddressCreateInput, AddressUncheckedCreateInput>
  }

  /**
   * Address createMany
   */
  export type AddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Addresses.
     */
    data: AddressCreateManyInput | AddressCreateManyInput[]
  }

  /**
   * Address update
   */
  export type AddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to update a Address.
     */
    data: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
    /**
     * Choose, which Address to update.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address updateMany
   */
  export type AddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Addresses.
     */
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyInput>
    /**
     * Filter which Addresses to update
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to update.
     */
    limit?: number
  }

  /**
   * Address upsert
   */
  export type AddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The filter to search for the Address to update in case it exists.
     */
    where: AddressWhereUniqueInput
    /**
     * In case the Address found by the `where` argument doesn't exist, create a new Address with this data.
     */
    create: XOR<AddressCreateInput, AddressUncheckedCreateInput>
    /**
     * In case the Address was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
  }

  /**
   * Address delete
   */
  export type AddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter which Address to delete.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address deleteMany
   */
  export type AddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Addresses to delete
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to delete.
     */
    limit?: number
  }

  /**
   * Address without action
   */
  export type AddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
  }


  /**
   * Model LRRequest
   */

  export type AggregateLRRequest = {
    _count: LRRequestCountAggregateOutputType | null
    _avg: LRRequestAvgAggregateOutputType | null
    _sum: LRRequestSumAggregateOutputType | null
    _min: LRRequestMinAggregateOutputType | null
    _max: LRRequestMaxAggregateOutputType | null
  }

  export type LRRequestAvgAggregateOutputType = {
    priceOffered: number | null
    priceSettled: number | null
    extraCost: number | null
  }

  export type LRRequestSumAggregateOutputType = {
    priceOffered: number | null
    priceSettled: number | null
    extraCost: number | null
  }

  export type LRRequestMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    vehicleType: string | null
    vehicleNo: string | null
    CustomerName: string | null
    LRNumber: string | null
    origin: string | null
    destination: string | null
    outDate: Date | null
    status: string | null
    priceOffered: number | null
    priceSettled: number | null
    extraCost: number | null
    fileNumber: string | null
    remark: string | null
    isInvoiced: boolean | null
    podlink: string | null
    tvendorId: string | null
    invoiceId: string | null
  }

  export type LRRequestMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    vehicleType: string | null
    vehicleNo: string | null
    CustomerName: string | null
    LRNumber: string | null
    origin: string | null
    destination: string | null
    outDate: Date | null
    status: string | null
    priceOffered: number | null
    priceSettled: number | null
    extraCost: number | null
    fileNumber: string | null
    remark: string | null
    isInvoiced: boolean | null
    podlink: string | null
    tvendorId: string | null
    invoiceId: string | null
  }

  export type LRRequestCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    vehicleType: number
    vehicleNo: number
    CustomerName: number
    LRNumber: number
    origin: number
    destination: number
    outDate: number
    status: number
    priceOffered: number
    priceSettled: number
    extraCost: number
    fileNumber: number
    remark: number
    isInvoiced: number
    podlink: number
    tvendorId: number
    invoiceId: number
    _all: number
  }


  export type LRRequestAvgAggregateInputType = {
    priceOffered?: true
    priceSettled?: true
    extraCost?: true
  }

  export type LRRequestSumAggregateInputType = {
    priceOffered?: true
    priceSettled?: true
    extraCost?: true
  }

  export type LRRequestMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    vehicleType?: true
    vehicleNo?: true
    CustomerName?: true
    LRNumber?: true
    origin?: true
    destination?: true
    outDate?: true
    status?: true
    priceOffered?: true
    priceSettled?: true
    extraCost?: true
    fileNumber?: true
    remark?: true
    isInvoiced?: true
    podlink?: true
    tvendorId?: true
    invoiceId?: true
  }

  export type LRRequestMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    vehicleType?: true
    vehicleNo?: true
    CustomerName?: true
    LRNumber?: true
    origin?: true
    destination?: true
    outDate?: true
    status?: true
    priceOffered?: true
    priceSettled?: true
    extraCost?: true
    fileNumber?: true
    remark?: true
    isInvoiced?: true
    podlink?: true
    tvendorId?: true
    invoiceId?: true
  }

  export type LRRequestCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    vehicleType?: true
    vehicleNo?: true
    CustomerName?: true
    LRNumber?: true
    origin?: true
    destination?: true
    outDate?: true
    status?: true
    priceOffered?: true
    priceSettled?: true
    extraCost?: true
    fileNumber?: true
    remark?: true
    isInvoiced?: true
    podlink?: true
    tvendorId?: true
    invoiceId?: true
    _all?: true
  }

  export type LRRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LRRequest to aggregate.
     */
    where?: LRRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LRRequests to fetch.
     */
    orderBy?: LRRequestOrderByWithRelationInput | LRRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LRRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LRRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LRRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LRRequests
    **/
    _count?: true | LRRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LRRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LRRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LRRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LRRequestMaxAggregateInputType
  }

  export type GetLRRequestAggregateType<T extends LRRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateLRRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLRRequest[P]>
      : GetScalarType<T[P], AggregateLRRequest[P]>
  }




  export type LRRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LRRequestWhereInput
    orderBy?: LRRequestOrderByWithAggregationInput | LRRequestOrderByWithAggregationInput[]
    by: LRRequestScalarFieldEnum[] | LRRequestScalarFieldEnum
    having?: LRRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LRRequestCountAggregateInputType | true
    _avg?: LRRequestAvgAggregateInputType
    _sum?: LRRequestSumAggregateInputType
    _min?: LRRequestMinAggregateInputType
    _max?: LRRequestMaxAggregateInputType
  }

  export type LRRequestGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    vehicleType: string | null
    vehicleNo: string | null
    CustomerName: string | null
    LRNumber: string
    origin: string | null
    destination: string | null
    outDate: Date
    status: string | null
    priceOffered: number | null
    priceSettled: number | null
    extraCost: number | null
    fileNumber: string
    remark: string | null
    isInvoiced: boolean
    podlink: string | null
    tvendorId: string
    invoiceId: string | null
    _count: LRRequestCountAggregateOutputType | null
    _avg: LRRequestAvgAggregateOutputType | null
    _sum: LRRequestSumAggregateOutputType | null
    _min: LRRequestMinAggregateOutputType | null
    _max: LRRequestMaxAggregateOutputType | null
  }

  type GetLRRequestGroupByPayload<T extends LRRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LRRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LRRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LRRequestGroupByOutputType[P]>
            : GetScalarType<T[P], LRRequestGroupByOutputType[P]>
        }
      >
    >


  export type LRRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicleType?: boolean
    vehicleNo?: boolean
    CustomerName?: boolean
    LRNumber?: boolean
    origin?: boolean
    destination?: boolean
    outDate?: boolean
    status?: boolean
    priceOffered?: boolean
    priceSettled?: boolean
    extraCost?: boolean
    fileNumber?: boolean
    remark?: boolean
    isInvoiced?: boolean
    podlink?: boolean
    tvendorId?: boolean
    invoiceId?: boolean
    tvendor?: boolean | VendorDefaultArgs<ExtArgs>
    Invoice?: boolean | LRRequest$InvoiceArgs<ExtArgs>
  }, ExtArgs["result"]["lRRequest"]>



  export type LRRequestSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicleType?: boolean
    vehicleNo?: boolean
    CustomerName?: boolean
    LRNumber?: boolean
    origin?: boolean
    destination?: boolean
    outDate?: boolean
    status?: boolean
    priceOffered?: boolean
    priceSettled?: boolean
    extraCost?: boolean
    fileNumber?: boolean
    remark?: boolean
    isInvoiced?: boolean
    podlink?: boolean
    tvendorId?: boolean
    invoiceId?: boolean
  }

  export type LRRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "vehicleType" | "vehicleNo" | "CustomerName" | "LRNumber" | "origin" | "destination" | "outDate" | "status" | "priceOffered" | "priceSettled" | "extraCost" | "fileNumber" | "remark" | "isInvoiced" | "podlink" | "tvendorId" | "invoiceId", ExtArgs["result"]["lRRequest"]>
  export type LRRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tvendor?: boolean | VendorDefaultArgs<ExtArgs>
    Invoice?: boolean | LRRequest$InvoiceArgs<ExtArgs>
  }

  export type $LRRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LRRequest"
    objects: {
      tvendor: Prisma.$VendorPayload<ExtArgs>
      Invoice: Prisma.$InvoicePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      vehicleType: string | null
      vehicleNo: string | null
      CustomerName: string | null
      LRNumber: string
      origin: string | null
      destination: string | null
      outDate: Date
      status: string | null
      priceOffered: number | null
      priceSettled: number | null
      extraCost: number | null
      fileNumber: string
      remark: string | null
      isInvoiced: boolean
      podlink: string | null
      tvendorId: string
      invoiceId: string | null
    }, ExtArgs["result"]["lRRequest"]>
    composites: {}
  }

  type LRRequestGetPayload<S extends boolean | null | undefined | LRRequestDefaultArgs> = $Result.GetResult<Prisma.$LRRequestPayload, S>

  type LRRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LRRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LRRequestCountAggregateInputType | true
    }

  export interface LRRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LRRequest'], meta: { name: 'LRRequest' } }
    /**
     * Find zero or one LRRequest that matches the filter.
     * @param {LRRequestFindUniqueArgs} args - Arguments to find a LRRequest
     * @example
     * // Get one LRRequest
     * const lRRequest = await prisma.lRRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LRRequestFindUniqueArgs>(args: SelectSubset<T, LRRequestFindUniqueArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LRRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LRRequestFindUniqueOrThrowArgs} args - Arguments to find a LRRequest
     * @example
     * // Get one LRRequest
     * const lRRequest = await prisma.lRRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LRRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, LRRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LRRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LRRequestFindFirstArgs} args - Arguments to find a LRRequest
     * @example
     * // Get one LRRequest
     * const lRRequest = await prisma.lRRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LRRequestFindFirstArgs>(args?: SelectSubset<T, LRRequestFindFirstArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LRRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LRRequestFindFirstOrThrowArgs} args - Arguments to find a LRRequest
     * @example
     * // Get one LRRequest
     * const lRRequest = await prisma.lRRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LRRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, LRRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LRRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LRRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LRRequests
     * const lRRequests = await prisma.lRRequest.findMany()
     * 
     * // Get first 10 LRRequests
     * const lRRequests = await prisma.lRRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lRRequestWithIdOnly = await prisma.lRRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LRRequestFindManyArgs>(args?: SelectSubset<T, LRRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LRRequest.
     * @param {LRRequestCreateArgs} args - Arguments to create a LRRequest.
     * @example
     * // Create one LRRequest
     * const LRRequest = await prisma.lRRequest.create({
     *   data: {
     *     // ... data to create a LRRequest
     *   }
     * })
     * 
     */
    create<T extends LRRequestCreateArgs>(args: SelectSubset<T, LRRequestCreateArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LRRequests.
     * @param {LRRequestCreateManyArgs} args - Arguments to create many LRRequests.
     * @example
     * // Create many LRRequests
     * const lRRequest = await prisma.lRRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LRRequestCreateManyArgs>(args?: SelectSubset<T, LRRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LRRequest.
     * @param {LRRequestDeleteArgs} args - Arguments to delete one LRRequest.
     * @example
     * // Delete one LRRequest
     * const LRRequest = await prisma.lRRequest.delete({
     *   where: {
     *     // ... filter to delete one LRRequest
     *   }
     * })
     * 
     */
    delete<T extends LRRequestDeleteArgs>(args: SelectSubset<T, LRRequestDeleteArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LRRequest.
     * @param {LRRequestUpdateArgs} args - Arguments to update one LRRequest.
     * @example
     * // Update one LRRequest
     * const lRRequest = await prisma.lRRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LRRequestUpdateArgs>(args: SelectSubset<T, LRRequestUpdateArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LRRequests.
     * @param {LRRequestDeleteManyArgs} args - Arguments to filter LRRequests to delete.
     * @example
     * // Delete a few LRRequests
     * const { count } = await prisma.lRRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LRRequestDeleteManyArgs>(args?: SelectSubset<T, LRRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LRRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LRRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LRRequests
     * const lRRequest = await prisma.lRRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LRRequestUpdateManyArgs>(args: SelectSubset<T, LRRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LRRequest.
     * @param {LRRequestUpsertArgs} args - Arguments to update or create a LRRequest.
     * @example
     * // Update or create a LRRequest
     * const lRRequest = await prisma.lRRequest.upsert({
     *   create: {
     *     // ... data to create a LRRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LRRequest we want to update
     *   }
     * })
     */
    upsert<T extends LRRequestUpsertArgs>(args: SelectSubset<T, LRRequestUpsertArgs<ExtArgs>>): Prisma__LRRequestClient<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LRRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LRRequestCountArgs} args - Arguments to filter LRRequests to count.
     * @example
     * // Count the number of LRRequests
     * const count = await prisma.lRRequest.count({
     *   where: {
     *     // ... the filter for the LRRequests we want to count
     *   }
     * })
    **/
    count<T extends LRRequestCountArgs>(
      args?: Subset<T, LRRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LRRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LRRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LRRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LRRequestAggregateArgs>(args: Subset<T, LRRequestAggregateArgs>): Prisma.PrismaPromise<GetLRRequestAggregateType<T>>

    /**
     * Group by LRRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LRRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LRRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LRRequestGroupByArgs['orderBy'] }
        : { orderBy?: LRRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LRRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLRRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LRRequest model
   */
  readonly fields: LRRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LRRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LRRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tvendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Invoice<T extends LRRequest$InvoiceArgs<ExtArgs> = {}>(args?: Subset<T, LRRequest$InvoiceArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LRRequest model
   */
  interface LRRequestFieldRefs {
    readonly id: FieldRef<"LRRequest", 'String'>
    readonly createdAt: FieldRef<"LRRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"LRRequest", 'DateTime'>
    readonly vehicleType: FieldRef<"LRRequest", 'String'>
    readonly vehicleNo: FieldRef<"LRRequest", 'String'>
    readonly CustomerName: FieldRef<"LRRequest", 'String'>
    readonly LRNumber: FieldRef<"LRRequest", 'String'>
    readonly origin: FieldRef<"LRRequest", 'String'>
    readonly destination: FieldRef<"LRRequest", 'String'>
    readonly outDate: FieldRef<"LRRequest", 'DateTime'>
    readonly status: FieldRef<"LRRequest", 'String'>
    readonly priceOffered: FieldRef<"LRRequest", 'Float'>
    readonly priceSettled: FieldRef<"LRRequest", 'Float'>
    readonly extraCost: FieldRef<"LRRequest", 'Float'>
    readonly fileNumber: FieldRef<"LRRequest", 'String'>
    readonly remark: FieldRef<"LRRequest", 'String'>
    readonly isInvoiced: FieldRef<"LRRequest", 'Boolean'>
    readonly podlink: FieldRef<"LRRequest", 'String'>
    readonly tvendorId: FieldRef<"LRRequest", 'String'>
    readonly invoiceId: FieldRef<"LRRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LRRequest findUnique
   */
  export type LRRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * Filter, which LRRequest to fetch.
     */
    where: LRRequestWhereUniqueInput
  }

  /**
   * LRRequest findUniqueOrThrow
   */
  export type LRRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * Filter, which LRRequest to fetch.
     */
    where: LRRequestWhereUniqueInput
  }

  /**
   * LRRequest findFirst
   */
  export type LRRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * Filter, which LRRequest to fetch.
     */
    where?: LRRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LRRequests to fetch.
     */
    orderBy?: LRRequestOrderByWithRelationInput | LRRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LRRequests.
     */
    cursor?: LRRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LRRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LRRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LRRequests.
     */
    distinct?: LRRequestScalarFieldEnum | LRRequestScalarFieldEnum[]
  }

  /**
   * LRRequest findFirstOrThrow
   */
  export type LRRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * Filter, which LRRequest to fetch.
     */
    where?: LRRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LRRequests to fetch.
     */
    orderBy?: LRRequestOrderByWithRelationInput | LRRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LRRequests.
     */
    cursor?: LRRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LRRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LRRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LRRequests.
     */
    distinct?: LRRequestScalarFieldEnum | LRRequestScalarFieldEnum[]
  }

  /**
   * LRRequest findMany
   */
  export type LRRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * Filter, which LRRequests to fetch.
     */
    where?: LRRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LRRequests to fetch.
     */
    orderBy?: LRRequestOrderByWithRelationInput | LRRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LRRequests.
     */
    cursor?: LRRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LRRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LRRequests.
     */
    skip?: number
    distinct?: LRRequestScalarFieldEnum | LRRequestScalarFieldEnum[]
  }

  /**
   * LRRequest create
   */
  export type LRRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a LRRequest.
     */
    data: XOR<LRRequestCreateInput, LRRequestUncheckedCreateInput>
  }

  /**
   * LRRequest createMany
   */
  export type LRRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LRRequests.
     */
    data: LRRequestCreateManyInput | LRRequestCreateManyInput[]
  }

  /**
   * LRRequest update
   */
  export type LRRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a LRRequest.
     */
    data: XOR<LRRequestUpdateInput, LRRequestUncheckedUpdateInput>
    /**
     * Choose, which LRRequest to update.
     */
    where: LRRequestWhereUniqueInput
  }

  /**
   * LRRequest updateMany
   */
  export type LRRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LRRequests.
     */
    data: XOR<LRRequestUpdateManyMutationInput, LRRequestUncheckedUpdateManyInput>
    /**
     * Filter which LRRequests to update
     */
    where?: LRRequestWhereInput
    /**
     * Limit how many LRRequests to update.
     */
    limit?: number
  }

  /**
   * LRRequest upsert
   */
  export type LRRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the LRRequest to update in case it exists.
     */
    where: LRRequestWhereUniqueInput
    /**
     * In case the LRRequest found by the `where` argument doesn't exist, create a new LRRequest with this data.
     */
    create: XOR<LRRequestCreateInput, LRRequestUncheckedCreateInput>
    /**
     * In case the LRRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LRRequestUpdateInput, LRRequestUncheckedUpdateInput>
  }

  /**
   * LRRequest delete
   */
  export type LRRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    /**
     * Filter which LRRequest to delete.
     */
    where: LRRequestWhereUniqueInput
  }

  /**
   * LRRequest deleteMany
   */
  export type LRRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LRRequests to delete
     */
    where?: LRRequestWhereInput
    /**
     * Limit how many LRRequests to delete.
     */
    limit?: number
  }

  /**
   * LRRequest.Invoice
   */
  export type LRRequest$InvoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
  }

  /**
   * LRRequest without action
   */
  export type LRRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    invoiceNumber: string | null
    refernceNumber: string | null
    invoiceDate: Date | null
    vendorId: string | null
    poId: string | null
    status: string | null
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
    notes: string | null
    hasDiscrepancy: boolean | null
    discrepancyNotes: string | null
    billTo: string | null
    billToId: string | null
    billToGstin: string | null
    invoiceURI: string | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    invoiceNumber: string | null
    refernceNumber: string | null
    invoiceDate: Date | null
    vendorId: string | null
    poId: string | null
    status: string | null
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
    notes: string | null
    hasDiscrepancy: boolean | null
    discrepancyNotes: string | null
    billTo: string | null
    billToId: string | null
    billToGstin: string | null
    invoiceURI: string | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    invoiceNumber: number
    refernceNumber: number
    invoiceDate: number
    vendorId: number
    poId: number
    status: number
    subtotal: number
    taxRate: number
    taxAmount: number
    grandTotal: number
    notes: number
    hasDiscrepancy: number
    discrepancyNotes: number
    billTo: number
    billToId: number
    billToGstin: number
    invoiceURI: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
  }

  export type InvoiceSumAggregateInputType = {
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    invoiceNumber?: true
    refernceNumber?: true
    invoiceDate?: true
    vendorId?: true
    poId?: true
    status?: true
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
    notes?: true
    hasDiscrepancy?: true
    discrepancyNotes?: true
    billTo?: true
    billToId?: true
    billToGstin?: true
    invoiceURI?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    invoiceNumber?: true
    refernceNumber?: true
    invoiceDate?: true
    vendorId?: true
    poId?: true
    status?: true
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
    notes?: true
    hasDiscrepancy?: true
    discrepancyNotes?: true
    billTo?: true
    billToId?: true
    billToGstin?: true
    invoiceURI?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    invoiceNumber?: true
    refernceNumber?: true
    invoiceDate?: true
    vendorId?: true
    poId?: true
    status?: true
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
    notes?: true
    hasDiscrepancy?: true
    discrepancyNotes?: true
    billTo?: true
    billToId?: true
    billToGstin?: true
    invoiceURI?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    invoiceNumber: string | null
    refernceNumber: string
    invoiceDate: Date
    vendorId: string
    poId: string | null
    status: string
    subtotal: number
    taxRate: number
    taxAmount: number
    grandTotal: number
    notes: string | null
    hasDiscrepancy: boolean
    discrepancyNotes: string | null
    billTo: string | null
    billToId: string | null
    billToGstin: string | null
    invoiceURI: string | null
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoiceNumber?: boolean
    refernceNumber?: boolean
    invoiceDate?: boolean
    vendorId?: boolean
    poId?: boolean
    status?: boolean
    subtotal?: boolean
    taxRate?: boolean
    taxAmount?: boolean
    grandTotal?: boolean
    notes?: boolean
    hasDiscrepancy?: boolean
    discrepancyNotes?: boolean
    billTo?: boolean
    billToId?: boolean
    billToGstin?: boolean
    invoiceURI?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    purchaseOrder?: boolean | Invoice$purchaseOrderArgs<ExtArgs>
    items?: boolean | Invoice$itemsArgs<ExtArgs>
    LRRequest?: boolean | Invoice$LRRequestArgs<ExtArgs>
    InvoiceReference?: boolean | Invoice$InvoiceReferenceArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>



  export type InvoiceSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoiceNumber?: boolean
    refernceNumber?: boolean
    invoiceDate?: boolean
    vendorId?: boolean
    poId?: boolean
    status?: boolean
    subtotal?: boolean
    taxRate?: boolean
    taxAmount?: boolean
    grandTotal?: boolean
    notes?: boolean
    hasDiscrepancy?: boolean
    discrepancyNotes?: boolean
    billTo?: boolean
    billToId?: boolean
    billToGstin?: boolean
    invoiceURI?: boolean
  }

  export type InvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "invoiceNumber" | "refernceNumber" | "invoiceDate" | "vendorId" | "poId" | "status" | "subtotal" | "taxRate" | "taxAmount" | "grandTotal" | "notes" | "hasDiscrepancy" | "discrepancyNotes" | "billTo" | "billToId" | "billToGstin" | "invoiceURI", ExtArgs["result"]["invoice"]>
  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    purchaseOrder?: boolean | Invoice$purchaseOrderArgs<ExtArgs>
    items?: boolean | Invoice$itemsArgs<ExtArgs>
    LRRequest?: boolean | Invoice$LRRequestArgs<ExtArgs>
    InvoiceReference?: boolean | Invoice$InvoiceReferenceArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
      purchaseOrder: Prisma.$PurchaseOrderPayload<ExtArgs> | null
      items: Prisma.$InvoiceItemPayload<ExtArgs>[]
      LRRequest: Prisma.$LRRequestPayload<ExtArgs>[]
      InvoiceReference: Prisma.$InvoiceReferencePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      invoiceNumber: string | null
      refernceNumber: string
      invoiceDate: Date
      vendorId: string
      poId: string | null
      status: string
      subtotal: number
      taxRate: number
      taxAmount: number
      grandTotal: number
      notes: string | null
      hasDiscrepancy: boolean
      discrepancyNotes: string | null
      billTo: string | null
      billToId: string | null
      billToGstin: string | null
      invoiceURI: string | null
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    purchaseOrder<T extends Invoice$purchaseOrderArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$purchaseOrderArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    items<T extends Invoice$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    LRRequest<T extends Invoice$LRRequestArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$LRRequestArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LRRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    InvoiceReference<T extends Invoice$InvoiceReferenceArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$InvoiceReferenceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"Invoice", 'DateTime'>
    readonly invoiceNumber: FieldRef<"Invoice", 'String'>
    readonly refernceNumber: FieldRef<"Invoice", 'String'>
    readonly invoiceDate: FieldRef<"Invoice", 'DateTime'>
    readonly vendorId: FieldRef<"Invoice", 'String'>
    readonly poId: FieldRef<"Invoice", 'String'>
    readonly status: FieldRef<"Invoice", 'String'>
    readonly subtotal: FieldRef<"Invoice", 'Float'>
    readonly taxRate: FieldRef<"Invoice", 'Float'>
    readonly taxAmount: FieldRef<"Invoice", 'Float'>
    readonly grandTotal: FieldRef<"Invoice", 'Float'>
    readonly notes: FieldRef<"Invoice", 'String'>
    readonly hasDiscrepancy: FieldRef<"Invoice", 'Boolean'>
    readonly discrepancyNotes: FieldRef<"Invoice", 'String'>
    readonly billTo: FieldRef<"Invoice", 'String'>
    readonly billToId: FieldRef<"Invoice", 'String'>
    readonly billToGstin: FieldRef<"Invoice", 'String'>
    readonly invoiceURI: FieldRef<"Invoice", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to delete.
     */
    limit?: number
  }

  /**
   * Invoice.purchaseOrder
   */
  export type Invoice$purchaseOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    where?: PurchaseOrderWhereInput
  }

  /**
   * Invoice.items
   */
  export type Invoice$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    where?: InvoiceItemWhereInput
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    cursor?: InvoiceItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * Invoice.LRRequest
   */
  export type Invoice$LRRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LRRequest
     */
    select?: LRRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LRRequest
     */
    omit?: LRRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LRRequestInclude<ExtArgs> | null
    where?: LRRequestWhereInput
    orderBy?: LRRequestOrderByWithRelationInput | LRRequestOrderByWithRelationInput[]
    cursor?: LRRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LRRequestScalarFieldEnum | LRRequestScalarFieldEnum[]
  }

  /**
   * Invoice.InvoiceReference
   */
  export type Invoice$InvoiceReferenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    where?: InvoiceReferenceWhereInput
    orderBy?: InvoiceReferenceOrderByWithRelationInput | InvoiceReferenceOrderByWithRelationInput[]
    cursor?: InvoiceReferenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceReferenceScalarFieldEnum | InvoiceReferenceScalarFieldEnum[]
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceReference
   */

  export type AggregateInvoiceReference = {
    _count: InvoiceReferenceCountAggregateOutputType | null
    _min: InvoiceReferenceMinAggregateOutputType | null
    _max: InvoiceReferenceMaxAggregateOutputType | null
  }

  export type InvoiceReferenceMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    from: Date | null
    to: Date | null
    dueDate: Date | null
    paidDate: Date | null
    refernceId: string | null
  }

  export type InvoiceReferenceMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    from: Date | null
    to: Date | null
    dueDate: Date | null
    paidDate: Date | null
    refernceId: string | null
  }

  export type InvoiceReferenceCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    from: number
    to: number
    dueDate: number
    paidDate: number
    refernceId: number
    _all: number
  }


  export type InvoiceReferenceMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    from?: true
    to?: true
    dueDate?: true
    paidDate?: true
    refernceId?: true
  }

  export type InvoiceReferenceMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    from?: true
    to?: true
    dueDate?: true
    paidDate?: true
    refernceId?: true
  }

  export type InvoiceReferenceCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    from?: true
    to?: true
    dueDate?: true
    paidDate?: true
    refernceId?: true
    _all?: true
  }

  export type InvoiceReferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceReference to aggregate.
     */
    where?: InvoiceReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceReferences to fetch.
     */
    orderBy?: InvoiceReferenceOrderByWithRelationInput | InvoiceReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceReferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceReferences
    **/
    _count?: true | InvoiceReferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceReferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceReferenceMaxAggregateInputType
  }

  export type GetInvoiceReferenceAggregateType<T extends InvoiceReferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceReference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceReference[P]>
      : GetScalarType<T[P], AggregateInvoiceReference[P]>
  }




  export type InvoiceReferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceReferenceWhereInput
    orderBy?: InvoiceReferenceOrderByWithAggregationInput | InvoiceReferenceOrderByWithAggregationInput[]
    by: InvoiceReferenceScalarFieldEnum[] | InvoiceReferenceScalarFieldEnum
    having?: InvoiceReferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceReferenceCountAggregateInputType | true
    _min?: InvoiceReferenceMinAggregateInputType
    _max?: InvoiceReferenceMaxAggregateInputType
  }

  export type InvoiceReferenceGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    from: Date
    to: Date
    dueDate: Date | null
    paidDate: Date | null
    refernceId: string
    _count: InvoiceReferenceCountAggregateOutputType | null
    _min: InvoiceReferenceMinAggregateOutputType | null
    _max: InvoiceReferenceMaxAggregateOutputType | null
  }

  type GetInvoiceReferenceGroupByPayload<T extends InvoiceReferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceReferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceReferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceReferenceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceReferenceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceReferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    from?: boolean
    to?: boolean
    dueDate?: boolean
    paidDate?: boolean
    refernceId?: boolean
    invoiceRefernce?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceReference"]>



  export type InvoiceReferenceSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    from?: boolean
    to?: boolean
    dueDate?: boolean
    paidDate?: boolean
    refernceId?: boolean
  }

  export type InvoiceReferenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "from" | "to" | "dueDate" | "paidDate" | "refernceId", ExtArgs["result"]["invoiceReference"]>
  export type InvoiceReferenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceRefernce?: boolean | InvoiceDefaultArgs<ExtArgs>
  }

  export type $InvoiceReferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceReference"
    objects: {
      invoiceRefernce: Prisma.$InvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      from: Date
      to: Date
      dueDate: Date | null
      paidDate: Date | null
      refernceId: string
    }, ExtArgs["result"]["invoiceReference"]>
    composites: {}
  }

  type InvoiceReferenceGetPayload<S extends boolean | null | undefined | InvoiceReferenceDefaultArgs> = $Result.GetResult<Prisma.$InvoiceReferencePayload, S>

  type InvoiceReferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceReferenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceReferenceCountAggregateInputType | true
    }

  export interface InvoiceReferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceReference'], meta: { name: 'InvoiceReference' } }
    /**
     * Find zero or one InvoiceReference that matches the filter.
     * @param {InvoiceReferenceFindUniqueArgs} args - Arguments to find a InvoiceReference
     * @example
     * // Get one InvoiceReference
     * const invoiceReference = await prisma.invoiceReference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceReferenceFindUniqueArgs>(args: SelectSubset<T, InvoiceReferenceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InvoiceReference that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceReferenceFindUniqueOrThrowArgs} args - Arguments to find a InvoiceReference
     * @example
     * // Get one InvoiceReference
     * const invoiceReference = await prisma.invoiceReference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceReferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceReferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceReference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceReferenceFindFirstArgs} args - Arguments to find a InvoiceReference
     * @example
     * // Get one InvoiceReference
     * const invoiceReference = await prisma.invoiceReference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceReferenceFindFirstArgs>(args?: SelectSubset<T, InvoiceReferenceFindFirstArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceReference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceReferenceFindFirstOrThrowArgs} args - Arguments to find a InvoiceReference
     * @example
     * // Get one InvoiceReference
     * const invoiceReference = await prisma.invoiceReference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceReferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceReferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InvoiceReferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceReferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceReferences
     * const invoiceReferences = await prisma.invoiceReference.findMany()
     * 
     * // Get first 10 InvoiceReferences
     * const invoiceReferences = await prisma.invoiceReference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceReferenceWithIdOnly = await prisma.invoiceReference.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceReferenceFindManyArgs>(args?: SelectSubset<T, InvoiceReferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InvoiceReference.
     * @param {InvoiceReferenceCreateArgs} args - Arguments to create a InvoiceReference.
     * @example
     * // Create one InvoiceReference
     * const InvoiceReference = await prisma.invoiceReference.create({
     *   data: {
     *     // ... data to create a InvoiceReference
     *   }
     * })
     * 
     */
    create<T extends InvoiceReferenceCreateArgs>(args: SelectSubset<T, InvoiceReferenceCreateArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InvoiceReferences.
     * @param {InvoiceReferenceCreateManyArgs} args - Arguments to create many InvoiceReferences.
     * @example
     * // Create many InvoiceReferences
     * const invoiceReference = await prisma.invoiceReference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceReferenceCreateManyArgs>(args?: SelectSubset<T, InvoiceReferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InvoiceReference.
     * @param {InvoiceReferenceDeleteArgs} args - Arguments to delete one InvoiceReference.
     * @example
     * // Delete one InvoiceReference
     * const InvoiceReference = await prisma.invoiceReference.delete({
     *   where: {
     *     // ... filter to delete one InvoiceReference
     *   }
     * })
     * 
     */
    delete<T extends InvoiceReferenceDeleteArgs>(args: SelectSubset<T, InvoiceReferenceDeleteArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InvoiceReference.
     * @param {InvoiceReferenceUpdateArgs} args - Arguments to update one InvoiceReference.
     * @example
     * // Update one InvoiceReference
     * const invoiceReference = await prisma.invoiceReference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceReferenceUpdateArgs>(args: SelectSubset<T, InvoiceReferenceUpdateArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InvoiceReferences.
     * @param {InvoiceReferenceDeleteManyArgs} args - Arguments to filter InvoiceReferences to delete.
     * @example
     * // Delete a few InvoiceReferences
     * const { count } = await prisma.invoiceReference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceReferenceDeleteManyArgs>(args?: SelectSubset<T, InvoiceReferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceReferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceReferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceReferences
     * const invoiceReference = await prisma.invoiceReference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceReferenceUpdateManyArgs>(args: SelectSubset<T, InvoiceReferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvoiceReference.
     * @param {InvoiceReferenceUpsertArgs} args - Arguments to update or create a InvoiceReference.
     * @example
     * // Update or create a InvoiceReference
     * const invoiceReference = await prisma.invoiceReference.upsert({
     *   create: {
     *     // ... data to create a InvoiceReference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceReference we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceReferenceUpsertArgs>(args: SelectSubset<T, InvoiceReferenceUpsertArgs<ExtArgs>>): Prisma__InvoiceReferenceClient<$Result.GetResult<Prisma.$InvoiceReferencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InvoiceReferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceReferenceCountArgs} args - Arguments to filter InvoiceReferences to count.
     * @example
     * // Count the number of InvoiceReferences
     * const count = await prisma.invoiceReference.count({
     *   where: {
     *     // ... the filter for the InvoiceReferences we want to count
     *   }
     * })
    **/
    count<T extends InvoiceReferenceCountArgs>(
      args?: Subset<T, InvoiceReferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceReferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceReference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceReferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceReferenceAggregateArgs>(args: Subset<T, InvoiceReferenceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceReferenceAggregateType<T>>

    /**
     * Group by InvoiceReference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceReferenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceReferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceReferenceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceReferenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceReferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceReferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceReference model
   */
  readonly fields: InvoiceReferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceReference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceReferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoiceRefernce<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceReference model
   */
  interface InvoiceReferenceFieldRefs {
    readonly id: FieldRef<"InvoiceReference", 'String'>
    readonly createdAt: FieldRef<"InvoiceReference", 'DateTime'>
    readonly updatedAt: FieldRef<"InvoiceReference", 'DateTime'>
    readonly from: FieldRef<"InvoiceReference", 'DateTime'>
    readonly to: FieldRef<"InvoiceReference", 'DateTime'>
    readonly dueDate: FieldRef<"InvoiceReference", 'DateTime'>
    readonly paidDate: FieldRef<"InvoiceReference", 'DateTime'>
    readonly refernceId: FieldRef<"InvoiceReference", 'String'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceReference findUnique
   */
  export type InvoiceReferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceReference to fetch.
     */
    where: InvoiceReferenceWhereUniqueInput
  }

  /**
   * InvoiceReference findUniqueOrThrow
   */
  export type InvoiceReferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceReference to fetch.
     */
    where: InvoiceReferenceWhereUniqueInput
  }

  /**
   * InvoiceReference findFirst
   */
  export type InvoiceReferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceReference to fetch.
     */
    where?: InvoiceReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceReferences to fetch.
     */
    orderBy?: InvoiceReferenceOrderByWithRelationInput | InvoiceReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceReferences.
     */
    cursor?: InvoiceReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceReferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceReferences.
     */
    distinct?: InvoiceReferenceScalarFieldEnum | InvoiceReferenceScalarFieldEnum[]
  }

  /**
   * InvoiceReference findFirstOrThrow
   */
  export type InvoiceReferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceReference to fetch.
     */
    where?: InvoiceReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceReferences to fetch.
     */
    orderBy?: InvoiceReferenceOrderByWithRelationInput | InvoiceReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceReferences.
     */
    cursor?: InvoiceReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceReferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceReferences.
     */
    distinct?: InvoiceReferenceScalarFieldEnum | InvoiceReferenceScalarFieldEnum[]
  }

  /**
   * InvoiceReference findMany
   */
  export type InvoiceReferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceReferences to fetch.
     */
    where?: InvoiceReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceReferences to fetch.
     */
    orderBy?: InvoiceReferenceOrderByWithRelationInput | InvoiceReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceReferences.
     */
    cursor?: InvoiceReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceReferences.
     */
    skip?: number
    distinct?: InvoiceReferenceScalarFieldEnum | InvoiceReferenceScalarFieldEnum[]
  }

  /**
   * InvoiceReference create
   */
  export type InvoiceReferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceReference.
     */
    data: XOR<InvoiceReferenceCreateInput, InvoiceReferenceUncheckedCreateInput>
  }

  /**
   * InvoiceReference createMany
   */
  export type InvoiceReferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceReferences.
     */
    data: InvoiceReferenceCreateManyInput | InvoiceReferenceCreateManyInput[]
  }

  /**
   * InvoiceReference update
   */
  export type InvoiceReferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceReference.
     */
    data: XOR<InvoiceReferenceUpdateInput, InvoiceReferenceUncheckedUpdateInput>
    /**
     * Choose, which InvoiceReference to update.
     */
    where: InvoiceReferenceWhereUniqueInput
  }

  /**
   * InvoiceReference updateMany
   */
  export type InvoiceReferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceReferences.
     */
    data: XOR<InvoiceReferenceUpdateManyMutationInput, InvoiceReferenceUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceReferences to update
     */
    where?: InvoiceReferenceWhereInput
    /**
     * Limit how many InvoiceReferences to update.
     */
    limit?: number
  }

  /**
   * InvoiceReference upsert
   */
  export type InvoiceReferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceReference to update in case it exists.
     */
    where: InvoiceReferenceWhereUniqueInput
    /**
     * In case the InvoiceReference found by the `where` argument doesn't exist, create a new InvoiceReference with this data.
     */
    create: XOR<InvoiceReferenceCreateInput, InvoiceReferenceUncheckedCreateInput>
    /**
     * In case the InvoiceReference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceReferenceUpdateInput, InvoiceReferenceUncheckedUpdateInput>
  }

  /**
   * InvoiceReference delete
   */
  export type InvoiceReferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
    /**
     * Filter which InvoiceReference to delete.
     */
    where: InvoiceReferenceWhereUniqueInput
  }

  /**
   * InvoiceReference deleteMany
   */
  export type InvoiceReferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceReferences to delete
     */
    where?: InvoiceReferenceWhereInput
    /**
     * Limit how many InvoiceReferences to delete.
     */
    limit?: number
  }

  /**
   * InvoiceReference without action
   */
  export type InvoiceReferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceReference
     */
    select?: InvoiceReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceReference
     */
    omit?: InvoiceReferenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceReferenceInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceItem
   */

  export type AggregateInvoiceItem = {
    _count: InvoiceItemCountAggregateOutputType | null
    _avg: InvoiceItemAvgAggregateOutputType | null
    _sum: InvoiceItemSumAggregateOutputType | null
    _min: InvoiceItemMinAggregateOutputType | null
    _max: InvoiceItemMaxAggregateOutputType | null
  }

  export type InvoiceItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type InvoiceItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type InvoiceItemMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    description: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceItemMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    description: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceItemCountAggregateOutputType = {
    id: number
    invoiceId: number
    description: number
    quantity: number
    unitPrice: number
    total: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvoiceItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type InvoiceItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type InvoiceItemMinAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    total?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceItemMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    total?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceItemCountAggregateInputType = {
    id?: true
    invoiceId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    total?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvoiceItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceItem to aggregate.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceItems
    **/
    _count?: true | InvoiceItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceItemMaxAggregateInputType
  }

  export type GetInvoiceItemAggregateType<T extends InvoiceItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceItem[P]>
      : GetScalarType<T[P], AggregateInvoiceItem[P]>
  }




  export type InvoiceItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceItemWhereInput
    orderBy?: InvoiceItemOrderByWithAggregationInput | InvoiceItemOrderByWithAggregationInput[]
    by: InvoiceItemScalarFieldEnum[] | InvoiceItemScalarFieldEnum
    having?: InvoiceItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceItemCountAggregateInputType | true
    _avg?: InvoiceItemAvgAggregateInputType
    _sum?: InvoiceItemSumAggregateInputType
    _min?: InvoiceItemMinAggregateInputType
    _max?: InvoiceItemMaxAggregateInputType
  }

  export type InvoiceItemGroupByOutputType = {
    id: string
    invoiceId: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: InvoiceItemCountAggregateOutputType | null
    _avg: InvoiceItemAvgAggregateOutputType | null
    _sum: InvoiceItemSumAggregateOutputType | null
    _min: InvoiceItemMinAggregateOutputType | null
    _max: InvoiceItemMaxAggregateOutputType | null
  }

  type GetInvoiceItemGroupByPayload<T extends InvoiceItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceItemGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceItemGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceItem"]>



  export type InvoiceItemSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvoiceItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "description" | "quantity" | "unitPrice" | "total" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["invoiceItem"]>
  export type InvoiceItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }

  export type $InvoiceItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceItem"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      description: string
      quantity: number
      unitPrice: number
      total: number
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["invoiceItem"]>
    composites: {}
  }

  type InvoiceItemGetPayload<S extends boolean | null | undefined | InvoiceItemDefaultArgs> = $Result.GetResult<Prisma.$InvoiceItemPayload, S>

  type InvoiceItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceItemCountAggregateInputType | true
    }

  export interface InvoiceItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceItem'], meta: { name: 'InvoiceItem' } }
    /**
     * Find zero or one InvoiceItem that matches the filter.
     * @param {InvoiceItemFindUniqueArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceItemFindUniqueArgs>(args: SelectSubset<T, InvoiceItemFindUniqueArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InvoiceItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceItemFindUniqueOrThrowArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindFirstArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceItemFindFirstArgs>(args?: SelectSubset<T, InvoiceItemFindFirstArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindFirstOrThrowArgs} args - Arguments to find a InvoiceItem
     * @example
     * // Get one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InvoiceItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceItems
     * const invoiceItems = await prisma.invoiceItem.findMany()
     * 
     * // Get first 10 InvoiceItems
     * const invoiceItems = await prisma.invoiceItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceItemWithIdOnly = await prisma.invoiceItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceItemFindManyArgs>(args?: SelectSubset<T, InvoiceItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InvoiceItem.
     * @param {InvoiceItemCreateArgs} args - Arguments to create a InvoiceItem.
     * @example
     * // Create one InvoiceItem
     * const InvoiceItem = await prisma.invoiceItem.create({
     *   data: {
     *     // ... data to create a InvoiceItem
     *   }
     * })
     * 
     */
    create<T extends InvoiceItemCreateArgs>(args: SelectSubset<T, InvoiceItemCreateArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InvoiceItems.
     * @param {InvoiceItemCreateManyArgs} args - Arguments to create many InvoiceItems.
     * @example
     * // Create many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceItemCreateManyArgs>(args?: SelectSubset<T, InvoiceItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InvoiceItem.
     * @param {InvoiceItemDeleteArgs} args - Arguments to delete one InvoiceItem.
     * @example
     * // Delete one InvoiceItem
     * const InvoiceItem = await prisma.invoiceItem.delete({
     *   where: {
     *     // ... filter to delete one InvoiceItem
     *   }
     * })
     * 
     */
    delete<T extends InvoiceItemDeleteArgs>(args: SelectSubset<T, InvoiceItemDeleteArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InvoiceItem.
     * @param {InvoiceItemUpdateArgs} args - Arguments to update one InvoiceItem.
     * @example
     * // Update one InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceItemUpdateArgs>(args: SelectSubset<T, InvoiceItemUpdateArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InvoiceItems.
     * @param {InvoiceItemDeleteManyArgs} args - Arguments to filter InvoiceItems to delete.
     * @example
     * // Delete a few InvoiceItems
     * const { count } = await prisma.invoiceItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceItemDeleteManyArgs>(args?: SelectSubset<T, InvoiceItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceItems
     * const invoiceItem = await prisma.invoiceItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceItemUpdateManyArgs>(args: SelectSubset<T, InvoiceItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvoiceItem.
     * @param {InvoiceItemUpsertArgs} args - Arguments to update or create a InvoiceItem.
     * @example
     * // Update or create a InvoiceItem
     * const invoiceItem = await prisma.invoiceItem.upsert({
     *   create: {
     *     // ... data to create a InvoiceItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceItem we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceItemUpsertArgs>(args: SelectSubset<T, InvoiceItemUpsertArgs<ExtArgs>>): Prisma__InvoiceItemClient<$Result.GetResult<Prisma.$InvoiceItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InvoiceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemCountArgs} args - Arguments to filter InvoiceItems to count.
     * @example
     * // Count the number of InvoiceItems
     * const count = await prisma.invoiceItem.count({
     *   where: {
     *     // ... the filter for the InvoiceItems we want to count
     *   }
     * })
    **/
    count<T extends InvoiceItemCountArgs>(
      args?: Subset<T, InvoiceItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceItemAggregateArgs>(args: Subset<T, InvoiceItemAggregateArgs>): Prisma.PrismaPromise<GetInvoiceItemAggregateType<T>>

    /**
     * Group by InvoiceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceItemGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceItem model
   */
  readonly fields: InvoiceItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceItem model
   */
  interface InvoiceItemFieldRefs {
    readonly id: FieldRef<"InvoiceItem", 'String'>
    readonly invoiceId: FieldRef<"InvoiceItem", 'String'>
    readonly description: FieldRef<"InvoiceItem", 'String'>
    readonly quantity: FieldRef<"InvoiceItem", 'Int'>
    readonly unitPrice: FieldRef<"InvoiceItem", 'Float'>
    readonly total: FieldRef<"InvoiceItem", 'Float'>
    readonly notes: FieldRef<"InvoiceItem", 'String'>
    readonly createdAt: FieldRef<"InvoiceItem", 'DateTime'>
    readonly updatedAt: FieldRef<"InvoiceItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceItem findUnique
   */
  export type InvoiceItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem findUniqueOrThrow
   */
  export type InvoiceItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem findFirst
   */
  export type InvoiceItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceItems.
     */
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem findFirstOrThrow
   */
  export type InvoiceItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItem to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceItems.
     */
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem findMany
   */
  export type InvoiceItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceItems to fetch.
     */
    where?: InvoiceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceItems to fetch.
     */
    orderBy?: InvoiceItemOrderByWithRelationInput | InvoiceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceItems.
     */
    cursor?: InvoiceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceItems.
     */
    skip?: number
    distinct?: InvoiceItemScalarFieldEnum | InvoiceItemScalarFieldEnum[]
  }

  /**
   * InvoiceItem create
   */
  export type InvoiceItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceItem.
     */
    data: XOR<InvoiceItemCreateInput, InvoiceItemUncheckedCreateInput>
  }

  /**
   * InvoiceItem createMany
   */
  export type InvoiceItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceItems.
     */
    data: InvoiceItemCreateManyInput | InvoiceItemCreateManyInput[]
  }

  /**
   * InvoiceItem update
   */
  export type InvoiceItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceItem.
     */
    data: XOR<InvoiceItemUpdateInput, InvoiceItemUncheckedUpdateInput>
    /**
     * Choose, which InvoiceItem to update.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem updateMany
   */
  export type InvoiceItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceItems.
     */
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceItems to update
     */
    where?: InvoiceItemWhereInput
    /**
     * Limit how many InvoiceItems to update.
     */
    limit?: number
  }

  /**
   * InvoiceItem upsert
   */
  export type InvoiceItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceItem to update in case it exists.
     */
    where: InvoiceItemWhereUniqueInput
    /**
     * In case the InvoiceItem found by the `where` argument doesn't exist, create a new InvoiceItem with this data.
     */
    create: XOR<InvoiceItemCreateInput, InvoiceItemUncheckedCreateInput>
    /**
     * In case the InvoiceItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceItemUpdateInput, InvoiceItemUncheckedUpdateInput>
  }

  /**
   * InvoiceItem delete
   */
  export type InvoiceItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
    /**
     * Filter which InvoiceItem to delete.
     */
    where: InvoiceItemWhereUniqueInput
  }

  /**
   * InvoiceItem deleteMany
   */
  export type InvoiceItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceItems to delete
     */
    where?: InvoiceItemWhereInput
    /**
     * Limit how many InvoiceItems to delete.
     */
    limit?: number
  }

  /**
   * InvoiceItem without action
   */
  export type InvoiceItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceItem
     */
    select?: InvoiceItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceItem
     */
    omit?: InvoiceItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceItemInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseOrder
   */

  export type AggregatePurchaseOrder = {
    _count: PurchaseOrderCountAggregateOutputType | null
    _avg: PurchaseOrderAvgAggregateOutputType | null
    _sum: PurchaseOrderSumAggregateOutputType | null
    _min: PurchaseOrderMinAggregateOutputType | null
    _max: PurchaseOrderMaxAggregateOutputType | null
  }

  export type PurchaseOrderAvgAggregateOutputType = {
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
  }

  export type PurchaseOrderSumAggregateOutputType = {
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
  }

  export type PurchaseOrderMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    poNumber: string | null
    poDate: Date | null
    status: string | null
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
    notes: string | null
    attachments: string | null
    deliveryDate: Date | null
    deliveryAddress: string | null
    invoiceCopy: string | null
    vendorId: string | null
    userId: string | null
  }

  export type PurchaseOrderMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    poNumber: string | null
    poDate: Date | null
    status: string | null
    subtotal: number | null
    taxRate: number | null
    taxAmount: number | null
    grandTotal: number | null
    notes: string | null
    attachments: string | null
    deliveryDate: Date | null
    deliveryAddress: string | null
    invoiceCopy: string | null
    vendorId: string | null
    userId: string | null
  }

  export type PurchaseOrderCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    poNumber: number
    poDate: number
    status: number
    subtotal: number
    taxRate: number
    taxAmount: number
    grandTotal: number
    notes: number
    attachments: number
    deliveryDate: number
    deliveryAddress: number
    invoiceCopy: number
    vendorId: number
    userId: number
    _all: number
  }


  export type PurchaseOrderAvgAggregateInputType = {
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
  }

  export type PurchaseOrderSumAggregateInputType = {
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
  }

  export type PurchaseOrderMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    poNumber?: true
    poDate?: true
    status?: true
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
    notes?: true
    attachments?: true
    deliveryDate?: true
    deliveryAddress?: true
    invoiceCopy?: true
    vendorId?: true
    userId?: true
  }

  export type PurchaseOrderMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    poNumber?: true
    poDate?: true
    status?: true
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
    notes?: true
    attachments?: true
    deliveryDate?: true
    deliveryAddress?: true
    invoiceCopy?: true
    vendorId?: true
    userId?: true
  }

  export type PurchaseOrderCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    poNumber?: true
    poDate?: true
    status?: true
    subtotal?: true
    taxRate?: true
    taxAmount?: true
    grandTotal?: true
    notes?: true
    attachments?: true
    deliveryDate?: true
    deliveryAddress?: true
    invoiceCopy?: true
    vendorId?: true
    userId?: true
    _all?: true
  }

  export type PurchaseOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrder to aggregate.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseOrders
    **/
    _count?: true | PurchaseOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseOrderMaxAggregateInputType
  }

  export type GetPurchaseOrderAggregateType<T extends PurchaseOrderAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseOrder[P]>
      : GetScalarType<T[P], AggregatePurchaseOrder[P]>
  }




  export type PurchaseOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderWhereInput
    orderBy?: PurchaseOrderOrderByWithAggregationInput | PurchaseOrderOrderByWithAggregationInput[]
    by: PurchaseOrderScalarFieldEnum[] | PurchaseOrderScalarFieldEnum
    having?: PurchaseOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseOrderCountAggregateInputType | true
    _avg?: PurchaseOrderAvgAggregateInputType
    _sum?: PurchaseOrderSumAggregateInputType
    _min?: PurchaseOrderMinAggregateInputType
    _max?: PurchaseOrderMaxAggregateInputType
  }

  export type PurchaseOrderGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    poNumber: string
    poDate: Date
    status: string
    subtotal: number
    taxRate: number
    taxAmount: number
    grandTotal: number
    notes: string | null
    attachments: string | null
    deliveryDate: Date | null
    deliveryAddress: string | null
    invoiceCopy: string | null
    vendorId: string
    userId: string
    _count: PurchaseOrderCountAggregateOutputType | null
    _avg: PurchaseOrderAvgAggregateOutputType | null
    _sum: PurchaseOrderSumAggregateOutputType | null
    _min: PurchaseOrderMinAggregateOutputType | null
    _max: PurchaseOrderMaxAggregateOutputType | null
  }

  type GetPurchaseOrderGroupByPayload<T extends PurchaseOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseOrderGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseOrderGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    poNumber?: boolean
    poDate?: boolean
    status?: boolean
    subtotal?: boolean
    taxRate?: boolean
    taxAmount?: boolean
    grandTotal?: boolean
    notes?: boolean
    attachments?: boolean
    deliveryDate?: boolean
    deliveryAddress?: boolean
    invoiceCopy?: boolean
    vendorId?: boolean
    userId?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | PurchaseOrder$itemsArgs<ExtArgs>
    invoices?: boolean | PurchaseOrder$invoicesArgs<ExtArgs>
    _count?: boolean | PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseOrder"]>



  export type PurchaseOrderSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    poNumber?: boolean
    poDate?: boolean
    status?: boolean
    subtotal?: boolean
    taxRate?: boolean
    taxAmount?: boolean
    grandTotal?: boolean
    notes?: boolean
    attachments?: boolean
    deliveryDate?: boolean
    deliveryAddress?: boolean
    invoiceCopy?: boolean
    vendorId?: boolean
    userId?: boolean
  }

  export type PurchaseOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "poNumber" | "poDate" | "status" | "subtotal" | "taxRate" | "taxAmount" | "grandTotal" | "notes" | "attachments" | "deliveryDate" | "deliveryAddress" | "invoiceCopy" | "vendorId" | "userId", ExtArgs["result"]["purchaseOrder"]>
  export type PurchaseOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | PurchaseOrder$itemsArgs<ExtArgs>
    invoices?: boolean | PurchaseOrder$invoicesArgs<ExtArgs>
    _count?: boolean | PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PurchaseOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseOrder"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      items: Prisma.$PurchaseOrderItemPayload<ExtArgs>[]
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      poNumber: string
      poDate: Date
      status: string
      subtotal: number
      taxRate: number
      taxAmount: number
      grandTotal: number
      notes: string | null
      attachments: string | null
      deliveryDate: Date | null
      deliveryAddress: string | null
      invoiceCopy: string | null
      vendorId: string
      userId: string
    }, ExtArgs["result"]["purchaseOrder"]>
    composites: {}
  }

  type PurchaseOrderGetPayload<S extends boolean | null | undefined | PurchaseOrderDefaultArgs> = $Result.GetResult<Prisma.$PurchaseOrderPayload, S>

  type PurchaseOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseOrderCountAggregateInputType | true
    }

  export interface PurchaseOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseOrder'], meta: { name: 'PurchaseOrder' } }
    /**
     * Find zero or one PurchaseOrder that matches the filter.
     * @param {PurchaseOrderFindUniqueArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseOrderFindUniqueArgs>(args: SelectSubset<T, PurchaseOrderFindUniqueArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseOrderFindUniqueOrThrowArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderFindFirstArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseOrderFindFirstArgs>(args?: SelectSubset<T, PurchaseOrderFindFirstArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderFindFirstOrThrowArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseOrders
     * const purchaseOrders = await prisma.purchaseOrder.findMany()
     * 
     * // Get first 10 PurchaseOrders
     * const purchaseOrders = await prisma.purchaseOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseOrderWithIdOnly = await prisma.purchaseOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseOrderFindManyArgs>(args?: SelectSubset<T, PurchaseOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseOrder.
     * @param {PurchaseOrderCreateArgs} args - Arguments to create a PurchaseOrder.
     * @example
     * // Create one PurchaseOrder
     * const PurchaseOrder = await prisma.purchaseOrder.create({
     *   data: {
     *     // ... data to create a PurchaseOrder
     *   }
     * })
     * 
     */
    create<T extends PurchaseOrderCreateArgs>(args: SelectSubset<T, PurchaseOrderCreateArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseOrders.
     * @param {PurchaseOrderCreateManyArgs} args - Arguments to create many PurchaseOrders.
     * @example
     * // Create many PurchaseOrders
     * const purchaseOrder = await prisma.purchaseOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseOrderCreateManyArgs>(args?: SelectSubset<T, PurchaseOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PurchaseOrder.
     * @param {PurchaseOrderDeleteArgs} args - Arguments to delete one PurchaseOrder.
     * @example
     * // Delete one PurchaseOrder
     * const PurchaseOrder = await prisma.purchaseOrder.delete({
     *   where: {
     *     // ... filter to delete one PurchaseOrder
     *   }
     * })
     * 
     */
    delete<T extends PurchaseOrderDeleteArgs>(args: SelectSubset<T, PurchaseOrderDeleteArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseOrder.
     * @param {PurchaseOrderUpdateArgs} args - Arguments to update one PurchaseOrder.
     * @example
     * // Update one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseOrderUpdateArgs>(args: SelectSubset<T, PurchaseOrderUpdateArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseOrders.
     * @param {PurchaseOrderDeleteManyArgs} args - Arguments to filter PurchaseOrders to delete.
     * @example
     * // Delete a few PurchaseOrders
     * const { count } = await prisma.purchaseOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseOrderDeleteManyArgs>(args?: SelectSubset<T, PurchaseOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseOrders
     * const purchaseOrder = await prisma.purchaseOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseOrderUpdateManyArgs>(args: SelectSubset<T, PurchaseOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PurchaseOrder.
     * @param {PurchaseOrderUpsertArgs} args - Arguments to update or create a PurchaseOrder.
     * @example
     * // Update or create a PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.upsert({
     *   create: {
     *     // ... data to create a PurchaseOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseOrder we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseOrderUpsertArgs>(args: SelectSubset<T, PurchaseOrderUpsertArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderCountArgs} args - Arguments to filter PurchaseOrders to count.
     * @example
     * // Count the number of PurchaseOrders
     * const count = await prisma.purchaseOrder.count({
     *   where: {
     *     // ... the filter for the PurchaseOrders we want to count
     *   }
     * })
    **/
    count<T extends PurchaseOrderCountArgs>(
      args?: Subset<T, PurchaseOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseOrderAggregateArgs>(args: Subset<T, PurchaseOrderAggregateArgs>): Prisma.PrismaPromise<GetPurchaseOrderAggregateType<T>>

    /**
     * Group by PurchaseOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseOrderGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseOrder model
   */
  readonly fields: PurchaseOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends PurchaseOrder$itemsArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseOrder$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends PurchaseOrder$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseOrder$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseOrder model
   */
  interface PurchaseOrderFieldRefs {
    readonly id: FieldRef<"PurchaseOrder", 'String'>
    readonly createdAt: FieldRef<"PurchaseOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"PurchaseOrder", 'DateTime'>
    readonly poNumber: FieldRef<"PurchaseOrder", 'String'>
    readonly poDate: FieldRef<"PurchaseOrder", 'DateTime'>
    readonly status: FieldRef<"PurchaseOrder", 'String'>
    readonly subtotal: FieldRef<"PurchaseOrder", 'Float'>
    readonly taxRate: FieldRef<"PurchaseOrder", 'Float'>
    readonly taxAmount: FieldRef<"PurchaseOrder", 'Float'>
    readonly grandTotal: FieldRef<"PurchaseOrder", 'Float'>
    readonly notes: FieldRef<"PurchaseOrder", 'String'>
    readonly attachments: FieldRef<"PurchaseOrder", 'String'>
    readonly deliveryDate: FieldRef<"PurchaseOrder", 'DateTime'>
    readonly deliveryAddress: FieldRef<"PurchaseOrder", 'String'>
    readonly invoiceCopy: FieldRef<"PurchaseOrder", 'String'>
    readonly vendorId: FieldRef<"PurchaseOrder", 'String'>
    readonly userId: FieldRef<"PurchaseOrder", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseOrder findUnique
   */
  export type PurchaseOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder findUniqueOrThrow
   */
  export type PurchaseOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder findFirst
   */
  export type PurchaseOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrders.
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrders.
     */
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * PurchaseOrder findFirstOrThrow
   */
  export type PurchaseOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrders.
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrders.
     */
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * PurchaseOrder findMany
   */
  export type PurchaseOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrders to fetch.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseOrders.
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * PurchaseOrder create
   */
  export type PurchaseOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseOrder.
     */
    data: XOR<PurchaseOrderCreateInput, PurchaseOrderUncheckedCreateInput>
  }

  /**
   * PurchaseOrder createMany
   */
  export type PurchaseOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseOrders.
     */
    data: PurchaseOrderCreateManyInput | PurchaseOrderCreateManyInput[]
  }

  /**
   * PurchaseOrder update
   */
  export type PurchaseOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseOrder.
     */
    data: XOR<PurchaseOrderUpdateInput, PurchaseOrderUncheckedUpdateInput>
    /**
     * Choose, which PurchaseOrder to update.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder updateMany
   */
  export type PurchaseOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseOrders.
     */
    data: XOR<PurchaseOrderUpdateManyMutationInput, PurchaseOrderUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseOrders to update
     */
    where?: PurchaseOrderWhereInput
    /**
     * Limit how many PurchaseOrders to update.
     */
    limit?: number
  }

  /**
   * PurchaseOrder upsert
   */
  export type PurchaseOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseOrder to update in case it exists.
     */
    where: PurchaseOrderWhereUniqueInput
    /**
     * In case the PurchaseOrder found by the `where` argument doesn't exist, create a new PurchaseOrder with this data.
     */
    create: XOR<PurchaseOrderCreateInput, PurchaseOrderUncheckedCreateInput>
    /**
     * In case the PurchaseOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseOrderUpdateInput, PurchaseOrderUncheckedUpdateInput>
  }

  /**
   * PurchaseOrder delete
   */
  export type PurchaseOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter which PurchaseOrder to delete.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder deleteMany
   */
  export type PurchaseOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrders to delete
     */
    where?: PurchaseOrderWhereInput
    /**
     * Limit how many PurchaseOrders to delete.
     */
    limit?: number
  }

  /**
   * PurchaseOrder.items
   */
  export type PurchaseOrder$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    where?: PurchaseOrderItemWhereInput
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    cursor?: PurchaseOrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrder.invoices
   */
  export type PurchaseOrder$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * PurchaseOrder without action
   */
  export type PurchaseOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrder
     */
    omit?: PurchaseOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseOrderItem
   */

  export type AggregatePurchaseOrderItem = {
    _count: PurchaseOrderItemCountAggregateOutputType | null
    _avg: PurchaseOrderItemAvgAggregateOutputType | null
    _sum: PurchaseOrderItemSumAggregateOutputType | null
    _min: PurchaseOrderItemMinAggregateOutputType | null
    _max: PurchaseOrderItemMaxAggregateOutputType | null
  }

  export type PurchaseOrderItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type PurchaseOrderItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    total: number | null
  }

  export type PurchaseOrderItemMinAggregateOutputType = {
    id: string | null
    poId: string | null
    description: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseOrderItemMaxAggregateOutputType = {
    id: string | null
    poId: string | null
    description: string | null
    quantity: number | null
    unitPrice: number | null
    total: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseOrderItemCountAggregateOutputType = {
    id: number
    poId: number
    description: number
    quantity: number
    unitPrice: number
    total: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PurchaseOrderItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type PurchaseOrderItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type PurchaseOrderItemMinAggregateInputType = {
    id?: true
    poId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    total?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseOrderItemMaxAggregateInputType = {
    id?: true
    poId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    total?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseOrderItemCountAggregateInputType = {
    id?: true
    poId?: true
    description?: true
    quantity?: true
    unitPrice?: true
    total?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PurchaseOrderItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrderItem to aggregate.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseOrderItems
    **/
    _count?: true | PurchaseOrderItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseOrderItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseOrderItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseOrderItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseOrderItemMaxAggregateInputType
  }

  export type GetPurchaseOrderItemAggregateType<T extends PurchaseOrderItemAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseOrderItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseOrderItem[P]>
      : GetScalarType<T[P], AggregatePurchaseOrderItem[P]>
  }




  export type PurchaseOrderItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderItemWhereInput
    orderBy?: PurchaseOrderItemOrderByWithAggregationInput | PurchaseOrderItemOrderByWithAggregationInput[]
    by: PurchaseOrderItemScalarFieldEnum[] | PurchaseOrderItemScalarFieldEnum
    having?: PurchaseOrderItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseOrderItemCountAggregateInputType | true
    _avg?: PurchaseOrderItemAvgAggregateInputType
    _sum?: PurchaseOrderItemSumAggregateInputType
    _min?: PurchaseOrderItemMinAggregateInputType
    _max?: PurchaseOrderItemMaxAggregateInputType
  }

  export type PurchaseOrderItemGroupByOutputType = {
    id: string
    poId: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: PurchaseOrderItemCountAggregateOutputType | null
    _avg: PurchaseOrderItemAvgAggregateOutputType | null
    _sum: PurchaseOrderItemSumAggregateOutputType | null
    _min: PurchaseOrderItemMinAggregateOutputType | null
    _max: PurchaseOrderItemMaxAggregateOutputType | null
  }

  type GetPurchaseOrderItemGroupByPayload<T extends PurchaseOrderItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseOrderItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseOrderItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseOrderItemGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseOrderItemGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseOrderItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    poId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    purchaseOrder?: boolean | PurchaseOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseOrderItem"]>



  export type PurchaseOrderItemSelectScalar = {
    id?: boolean
    poId?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    total?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PurchaseOrderItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "poId" | "description" | "quantity" | "unitPrice" | "total" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["purchaseOrderItem"]>
  export type PurchaseOrderItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchaseOrder?: boolean | PurchaseOrderDefaultArgs<ExtArgs>
  }

  export type $PurchaseOrderItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseOrderItem"
    objects: {
      purchaseOrder: Prisma.$PurchaseOrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      poId: string
      description: string
      quantity: number
      unitPrice: number
      total: number
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["purchaseOrderItem"]>
    composites: {}
  }

  type PurchaseOrderItemGetPayload<S extends boolean | null | undefined | PurchaseOrderItemDefaultArgs> = $Result.GetResult<Prisma.$PurchaseOrderItemPayload, S>

  type PurchaseOrderItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseOrderItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseOrderItemCountAggregateInputType | true
    }

  export interface PurchaseOrderItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseOrderItem'], meta: { name: 'PurchaseOrderItem' } }
    /**
     * Find zero or one PurchaseOrderItem that matches the filter.
     * @param {PurchaseOrderItemFindUniqueArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseOrderItemFindUniqueArgs>(args: SelectSubset<T, PurchaseOrderItemFindUniqueArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseOrderItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseOrderItemFindUniqueOrThrowArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseOrderItemFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseOrderItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseOrderItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemFindFirstArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseOrderItemFindFirstArgs>(args?: SelectSubset<T, PurchaseOrderItemFindFirstArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseOrderItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemFindFirstOrThrowArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseOrderItemFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseOrderItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseOrderItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseOrderItems
     * const purchaseOrderItems = await prisma.purchaseOrderItem.findMany()
     * 
     * // Get first 10 PurchaseOrderItems
     * const purchaseOrderItems = await prisma.purchaseOrderItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseOrderItemWithIdOnly = await prisma.purchaseOrderItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseOrderItemFindManyArgs>(args?: SelectSubset<T, PurchaseOrderItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseOrderItem.
     * @param {PurchaseOrderItemCreateArgs} args - Arguments to create a PurchaseOrderItem.
     * @example
     * // Create one PurchaseOrderItem
     * const PurchaseOrderItem = await prisma.purchaseOrderItem.create({
     *   data: {
     *     // ... data to create a PurchaseOrderItem
     *   }
     * })
     * 
     */
    create<T extends PurchaseOrderItemCreateArgs>(args: SelectSubset<T, PurchaseOrderItemCreateArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseOrderItems.
     * @param {PurchaseOrderItemCreateManyArgs} args - Arguments to create many PurchaseOrderItems.
     * @example
     * // Create many PurchaseOrderItems
     * const purchaseOrderItem = await prisma.purchaseOrderItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseOrderItemCreateManyArgs>(args?: SelectSubset<T, PurchaseOrderItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PurchaseOrderItem.
     * @param {PurchaseOrderItemDeleteArgs} args - Arguments to delete one PurchaseOrderItem.
     * @example
     * // Delete one PurchaseOrderItem
     * const PurchaseOrderItem = await prisma.purchaseOrderItem.delete({
     *   where: {
     *     // ... filter to delete one PurchaseOrderItem
     *   }
     * })
     * 
     */
    delete<T extends PurchaseOrderItemDeleteArgs>(args: SelectSubset<T, PurchaseOrderItemDeleteArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseOrderItem.
     * @param {PurchaseOrderItemUpdateArgs} args - Arguments to update one PurchaseOrderItem.
     * @example
     * // Update one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseOrderItemUpdateArgs>(args: SelectSubset<T, PurchaseOrderItemUpdateArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseOrderItems.
     * @param {PurchaseOrderItemDeleteManyArgs} args - Arguments to filter PurchaseOrderItems to delete.
     * @example
     * // Delete a few PurchaseOrderItems
     * const { count } = await prisma.purchaseOrderItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseOrderItemDeleteManyArgs>(args?: SelectSubset<T, PurchaseOrderItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseOrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseOrderItems
     * const purchaseOrderItem = await prisma.purchaseOrderItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseOrderItemUpdateManyArgs>(args: SelectSubset<T, PurchaseOrderItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PurchaseOrderItem.
     * @param {PurchaseOrderItemUpsertArgs} args - Arguments to update or create a PurchaseOrderItem.
     * @example
     * // Update or create a PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.upsert({
     *   create: {
     *     // ... data to create a PurchaseOrderItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseOrderItem we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseOrderItemUpsertArgs>(args: SelectSubset<T, PurchaseOrderItemUpsertArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseOrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemCountArgs} args - Arguments to filter PurchaseOrderItems to count.
     * @example
     * // Count the number of PurchaseOrderItems
     * const count = await prisma.purchaseOrderItem.count({
     *   where: {
     *     // ... the filter for the PurchaseOrderItems we want to count
     *   }
     * })
    **/
    count<T extends PurchaseOrderItemCountArgs>(
      args?: Subset<T, PurchaseOrderItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseOrderItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseOrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseOrderItemAggregateArgs>(args: Subset<T, PurchaseOrderItemAggregateArgs>): Prisma.PrismaPromise<GetPurchaseOrderItemAggregateType<T>>

    /**
     * Group by PurchaseOrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseOrderItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseOrderItemGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseOrderItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseOrderItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseOrderItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseOrderItem model
   */
  readonly fields: PurchaseOrderItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseOrderItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseOrderItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    purchaseOrder<T extends PurchaseOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseOrderDefaultArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseOrderItem model
   */
  interface PurchaseOrderItemFieldRefs {
    readonly id: FieldRef<"PurchaseOrderItem", 'String'>
    readonly poId: FieldRef<"PurchaseOrderItem", 'String'>
    readonly description: FieldRef<"PurchaseOrderItem", 'String'>
    readonly quantity: FieldRef<"PurchaseOrderItem", 'Int'>
    readonly unitPrice: FieldRef<"PurchaseOrderItem", 'Float'>
    readonly total: FieldRef<"PurchaseOrderItem", 'Float'>
    readonly notes: FieldRef<"PurchaseOrderItem", 'String'>
    readonly createdAt: FieldRef<"PurchaseOrderItem", 'DateTime'>
    readonly updatedAt: FieldRef<"PurchaseOrderItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseOrderItem findUnique
   */
  export type PurchaseOrderItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem findUniqueOrThrow
   */
  export type PurchaseOrderItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem findFirst
   */
  export type PurchaseOrderItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrderItems.
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrderItems.
     */
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrderItem findFirstOrThrow
   */
  export type PurchaseOrderItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrderItems.
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrderItems.
     */
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrderItem findMany
   */
  export type PurchaseOrderItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItems to fetch.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseOrderItems.
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrderItem create
   */
  export type PurchaseOrderItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseOrderItem.
     */
    data: XOR<PurchaseOrderItemCreateInput, PurchaseOrderItemUncheckedCreateInput>
  }

  /**
   * PurchaseOrderItem createMany
   */
  export type PurchaseOrderItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseOrderItems.
     */
    data: PurchaseOrderItemCreateManyInput | PurchaseOrderItemCreateManyInput[]
  }

  /**
   * PurchaseOrderItem update
   */
  export type PurchaseOrderItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseOrderItem.
     */
    data: XOR<PurchaseOrderItemUpdateInput, PurchaseOrderItemUncheckedUpdateInput>
    /**
     * Choose, which PurchaseOrderItem to update.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem updateMany
   */
  export type PurchaseOrderItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseOrderItems.
     */
    data: XOR<PurchaseOrderItemUpdateManyMutationInput, PurchaseOrderItemUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseOrderItems to update
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * Limit how many PurchaseOrderItems to update.
     */
    limit?: number
  }

  /**
   * PurchaseOrderItem upsert
   */
  export type PurchaseOrderItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseOrderItem to update in case it exists.
     */
    where: PurchaseOrderItemWhereUniqueInput
    /**
     * In case the PurchaseOrderItem found by the `where` argument doesn't exist, create a new PurchaseOrderItem with this data.
     */
    create: XOR<PurchaseOrderItemCreateInput, PurchaseOrderItemUncheckedCreateInput>
    /**
     * In case the PurchaseOrderItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseOrderItemUpdateInput, PurchaseOrderItemUncheckedUpdateInput>
  }

  /**
   * PurchaseOrderItem delete
   */
  export type PurchaseOrderItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter which PurchaseOrderItem to delete.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem deleteMany
   */
  export type PurchaseOrderItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrderItems to delete
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * Limit how many PurchaseOrderItems to delete.
     */
    limit?: number
  }

  /**
   * PurchaseOrderItem without action
   */
  export type PurchaseOrderItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderItem
     */
    omit?: PurchaseOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
    token: string | null
    ipAddress: string | null
    userAgent: string | null
    impersonatedBy: string | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
    token: string | null
    ipAddress: string | null
    userAgent: string | null
    impersonatedBy: string | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    expiresAt: number
    token: number
    ipAddress: number
    userAgent: number
    impersonatedBy: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    token?: true
    ipAddress?: true
    userAgent?: true
    impersonatedBy?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    token?: true
    ipAddress?: true
    userAgent?: true
    impersonatedBy?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    token?: true
    ipAddress?: true
    userAgent?: true
    impersonatedBy?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    token: string
    ipAddress: string | null
    userAgent: string | null
    impersonatedBy: string | null
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
    token?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    impersonatedBy?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>



  export type SessionSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
    token?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    impersonatedBy?: boolean
    userId?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "expiresAt" | "token" | "ipAddress" | "userAgent" | "impersonatedBy" | "userId", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      expiresAt: Date
      token: string
      ipAddress: string | null
      userAgent: string | null
      impersonatedBy: string | null
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly impersonatedBy: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accountId: string | null
    providerId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    scope: string | null
    password: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    userId: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    accountId: string | null
    providerId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    scope: string | null
    password: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    userId: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    accountId: number
    providerId: number
    accessToken: number
    refreshToken: number
    idToken: number
    scope: number
    password: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    userId: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    providerId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    scope?: true
    password?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    userId?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    providerId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    scope?: true
    password?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    userId?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    accountId?: true
    providerId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    scope?: true
    password?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    userId?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    accountId: string
    providerId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    scope: string | null
    password: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    userId: string
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    providerId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    scope?: boolean
    password?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>



  export type AccountSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountId?: boolean
    providerId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    scope?: boolean
    password?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    userId?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "accountId" | "providerId" | "accessToken" | "refreshToken" | "idToken" | "scope" | "password" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "userId", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      accountId: string
      providerId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      scope: string | null
      password: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      userId: string
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly userId: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    identifier: number
    value: number
    expiresAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    identifier?: true
    value?: true
    expiresAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    identifier?: true
    value?: true
    expiresAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    identifier?: true
    value?: true
    expiresAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    identifier: string
    value: string
    expiresAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["verification"]>



  export type VerificationSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "identifier" | "value" | "expiresAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      identifier: string
      value: string
      expiresAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model LorryReceipt
   */

  export type AggregateLorryReceipt = {
    _count: LorryReceiptCountAggregateOutputType | null
    _min: LorryReceiptMinAggregateOutputType | null
    _max: LorryReceiptMaxAggregateOutputType | null
  }

  export type LorryReceiptMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lrNo: string | null
    lrDate: string | null
    city: string | null
    transporter: string | null
    warehouse: string | null
    vehicleType: string | null
    vehicleNo: string | null
  }

  export type LorryReceiptMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lrNo: string | null
    lrDate: string | null
    city: string | null
    transporter: string | null
    warehouse: string | null
    vehicleType: string | null
    vehicleNo: string | null
  }

  export type LorryReceiptCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    lrNo: number
    lrDate: number
    city: number
    transporter: number
    warehouse: number
    vehicleType: number
    vehicleNo: number
    _all: number
  }


  export type LorryReceiptMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    lrNo?: true
    lrDate?: true
    city?: true
    transporter?: true
    warehouse?: true
    vehicleType?: true
    vehicleNo?: true
  }

  export type LorryReceiptMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    lrNo?: true
    lrDate?: true
    city?: true
    transporter?: true
    warehouse?: true
    vehicleType?: true
    vehicleNo?: true
  }

  export type LorryReceiptCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    lrNo?: true
    lrDate?: true
    city?: true
    transporter?: true
    warehouse?: true
    vehicleType?: true
    vehicleNo?: true
    _all?: true
  }

  export type LorryReceiptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LorryReceipt to aggregate.
     */
    where?: LorryReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LorryReceipts to fetch.
     */
    orderBy?: LorryReceiptOrderByWithRelationInput | LorryReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LorryReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LorryReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LorryReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LorryReceipts
    **/
    _count?: true | LorryReceiptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LorryReceiptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LorryReceiptMaxAggregateInputType
  }

  export type GetLorryReceiptAggregateType<T extends LorryReceiptAggregateArgs> = {
        [P in keyof T & keyof AggregateLorryReceipt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLorryReceipt[P]>
      : GetScalarType<T[P], AggregateLorryReceipt[P]>
  }




  export type LorryReceiptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LorryReceiptWhereInput
    orderBy?: LorryReceiptOrderByWithAggregationInput | LorryReceiptOrderByWithAggregationInput[]
    by: LorryReceiptScalarFieldEnum[] | LorryReceiptScalarFieldEnum
    having?: LorryReceiptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LorryReceiptCountAggregateInputType | true
    _min?: LorryReceiptMinAggregateInputType
    _max?: LorryReceiptMaxAggregateInputType
  }

  export type LorryReceiptGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    lrNo: string
    lrDate: string
    city: string
    transporter: string
    warehouse: string
    vehicleType: string
    vehicleNo: string
    _count: LorryReceiptCountAggregateOutputType | null
    _min: LorryReceiptMinAggregateOutputType | null
    _max: LorryReceiptMaxAggregateOutputType | null
  }

  type GetLorryReceiptGroupByPayload<T extends LorryReceiptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LorryReceiptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LorryReceiptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LorryReceiptGroupByOutputType[P]>
            : GetScalarType<T[P], LorryReceiptGroupByOutputType[P]>
        }
      >
    >


  export type LorryReceiptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lrNo?: boolean
    lrDate?: boolean
    city?: boolean
    transporter?: boolean
    warehouse?: boolean
    vehicleType?: boolean
    vehicleNo?: boolean
  }, ExtArgs["result"]["lorryReceipt"]>



  export type LorryReceiptSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lrNo?: boolean
    lrDate?: boolean
    city?: boolean
    transporter?: boolean
    warehouse?: boolean
    vehicleType?: boolean
    vehicleNo?: boolean
  }

  export type LorryReceiptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "lrNo" | "lrDate" | "city" | "transporter" | "warehouse" | "vehicleType" | "vehicleNo", ExtArgs["result"]["lorryReceipt"]>

  export type $LorryReceiptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LorryReceipt"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      lrNo: string
      lrDate: string
      city: string
      transporter: string
      warehouse: string
      vehicleType: string
      vehicleNo: string
    }, ExtArgs["result"]["lorryReceipt"]>
    composites: {}
  }

  type LorryReceiptGetPayload<S extends boolean | null | undefined | LorryReceiptDefaultArgs> = $Result.GetResult<Prisma.$LorryReceiptPayload, S>

  type LorryReceiptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LorryReceiptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LorryReceiptCountAggregateInputType | true
    }

  export interface LorryReceiptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LorryReceipt'], meta: { name: 'LorryReceipt' } }
    /**
     * Find zero or one LorryReceipt that matches the filter.
     * @param {LorryReceiptFindUniqueArgs} args - Arguments to find a LorryReceipt
     * @example
     * // Get one LorryReceipt
     * const lorryReceipt = await prisma.lorryReceipt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LorryReceiptFindUniqueArgs>(args: SelectSubset<T, LorryReceiptFindUniqueArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LorryReceipt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LorryReceiptFindUniqueOrThrowArgs} args - Arguments to find a LorryReceipt
     * @example
     * // Get one LorryReceipt
     * const lorryReceipt = await prisma.lorryReceipt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LorryReceiptFindUniqueOrThrowArgs>(args: SelectSubset<T, LorryReceiptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LorryReceipt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LorryReceiptFindFirstArgs} args - Arguments to find a LorryReceipt
     * @example
     * // Get one LorryReceipt
     * const lorryReceipt = await prisma.lorryReceipt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LorryReceiptFindFirstArgs>(args?: SelectSubset<T, LorryReceiptFindFirstArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LorryReceipt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LorryReceiptFindFirstOrThrowArgs} args - Arguments to find a LorryReceipt
     * @example
     * // Get one LorryReceipt
     * const lorryReceipt = await prisma.lorryReceipt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LorryReceiptFindFirstOrThrowArgs>(args?: SelectSubset<T, LorryReceiptFindFirstOrThrowArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LorryReceipts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LorryReceiptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LorryReceipts
     * const lorryReceipts = await prisma.lorryReceipt.findMany()
     * 
     * // Get first 10 LorryReceipts
     * const lorryReceipts = await prisma.lorryReceipt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lorryReceiptWithIdOnly = await prisma.lorryReceipt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LorryReceiptFindManyArgs>(args?: SelectSubset<T, LorryReceiptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LorryReceipt.
     * @param {LorryReceiptCreateArgs} args - Arguments to create a LorryReceipt.
     * @example
     * // Create one LorryReceipt
     * const LorryReceipt = await prisma.lorryReceipt.create({
     *   data: {
     *     // ... data to create a LorryReceipt
     *   }
     * })
     * 
     */
    create<T extends LorryReceiptCreateArgs>(args: SelectSubset<T, LorryReceiptCreateArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LorryReceipts.
     * @param {LorryReceiptCreateManyArgs} args - Arguments to create many LorryReceipts.
     * @example
     * // Create many LorryReceipts
     * const lorryReceipt = await prisma.lorryReceipt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LorryReceiptCreateManyArgs>(args?: SelectSubset<T, LorryReceiptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LorryReceipt.
     * @param {LorryReceiptDeleteArgs} args - Arguments to delete one LorryReceipt.
     * @example
     * // Delete one LorryReceipt
     * const LorryReceipt = await prisma.lorryReceipt.delete({
     *   where: {
     *     // ... filter to delete one LorryReceipt
     *   }
     * })
     * 
     */
    delete<T extends LorryReceiptDeleteArgs>(args: SelectSubset<T, LorryReceiptDeleteArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LorryReceipt.
     * @param {LorryReceiptUpdateArgs} args - Arguments to update one LorryReceipt.
     * @example
     * // Update one LorryReceipt
     * const lorryReceipt = await prisma.lorryReceipt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LorryReceiptUpdateArgs>(args: SelectSubset<T, LorryReceiptUpdateArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LorryReceipts.
     * @param {LorryReceiptDeleteManyArgs} args - Arguments to filter LorryReceipts to delete.
     * @example
     * // Delete a few LorryReceipts
     * const { count } = await prisma.lorryReceipt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LorryReceiptDeleteManyArgs>(args?: SelectSubset<T, LorryReceiptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LorryReceipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LorryReceiptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LorryReceipts
     * const lorryReceipt = await prisma.lorryReceipt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LorryReceiptUpdateManyArgs>(args: SelectSubset<T, LorryReceiptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LorryReceipt.
     * @param {LorryReceiptUpsertArgs} args - Arguments to update or create a LorryReceipt.
     * @example
     * // Update or create a LorryReceipt
     * const lorryReceipt = await prisma.lorryReceipt.upsert({
     *   create: {
     *     // ... data to create a LorryReceipt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LorryReceipt we want to update
     *   }
     * })
     */
    upsert<T extends LorryReceiptUpsertArgs>(args: SelectSubset<T, LorryReceiptUpsertArgs<ExtArgs>>): Prisma__LorryReceiptClient<$Result.GetResult<Prisma.$LorryReceiptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LorryReceipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LorryReceiptCountArgs} args - Arguments to filter LorryReceipts to count.
     * @example
     * // Count the number of LorryReceipts
     * const count = await prisma.lorryReceipt.count({
     *   where: {
     *     // ... the filter for the LorryReceipts we want to count
     *   }
     * })
    **/
    count<T extends LorryReceiptCountArgs>(
      args?: Subset<T, LorryReceiptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LorryReceiptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LorryReceipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LorryReceiptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LorryReceiptAggregateArgs>(args: Subset<T, LorryReceiptAggregateArgs>): Prisma.PrismaPromise<GetLorryReceiptAggregateType<T>>

    /**
     * Group by LorryReceipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LorryReceiptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LorryReceiptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LorryReceiptGroupByArgs['orderBy'] }
        : { orderBy?: LorryReceiptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LorryReceiptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLorryReceiptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LorryReceipt model
   */
  readonly fields: LorryReceiptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LorryReceipt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LorryReceiptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LorryReceipt model
   */
  interface LorryReceiptFieldRefs {
    readonly id: FieldRef<"LorryReceipt", 'String'>
    readonly createdAt: FieldRef<"LorryReceipt", 'DateTime'>
    readonly updatedAt: FieldRef<"LorryReceipt", 'DateTime'>
    readonly lrNo: FieldRef<"LorryReceipt", 'String'>
    readonly lrDate: FieldRef<"LorryReceipt", 'String'>
    readonly city: FieldRef<"LorryReceipt", 'String'>
    readonly transporter: FieldRef<"LorryReceipt", 'String'>
    readonly warehouse: FieldRef<"LorryReceipt", 'String'>
    readonly vehicleType: FieldRef<"LorryReceipt", 'String'>
    readonly vehicleNo: FieldRef<"LorryReceipt", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LorryReceipt findUnique
   */
  export type LorryReceiptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * Filter, which LorryReceipt to fetch.
     */
    where: LorryReceiptWhereUniqueInput
  }

  /**
   * LorryReceipt findUniqueOrThrow
   */
  export type LorryReceiptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * Filter, which LorryReceipt to fetch.
     */
    where: LorryReceiptWhereUniqueInput
  }

  /**
   * LorryReceipt findFirst
   */
  export type LorryReceiptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * Filter, which LorryReceipt to fetch.
     */
    where?: LorryReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LorryReceipts to fetch.
     */
    orderBy?: LorryReceiptOrderByWithRelationInput | LorryReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LorryReceipts.
     */
    cursor?: LorryReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LorryReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LorryReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LorryReceipts.
     */
    distinct?: LorryReceiptScalarFieldEnum | LorryReceiptScalarFieldEnum[]
  }

  /**
   * LorryReceipt findFirstOrThrow
   */
  export type LorryReceiptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * Filter, which LorryReceipt to fetch.
     */
    where?: LorryReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LorryReceipts to fetch.
     */
    orderBy?: LorryReceiptOrderByWithRelationInput | LorryReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LorryReceipts.
     */
    cursor?: LorryReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LorryReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LorryReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LorryReceipts.
     */
    distinct?: LorryReceiptScalarFieldEnum | LorryReceiptScalarFieldEnum[]
  }

  /**
   * LorryReceipt findMany
   */
  export type LorryReceiptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * Filter, which LorryReceipts to fetch.
     */
    where?: LorryReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LorryReceipts to fetch.
     */
    orderBy?: LorryReceiptOrderByWithRelationInput | LorryReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LorryReceipts.
     */
    cursor?: LorryReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LorryReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LorryReceipts.
     */
    skip?: number
    distinct?: LorryReceiptScalarFieldEnum | LorryReceiptScalarFieldEnum[]
  }

  /**
   * LorryReceipt create
   */
  export type LorryReceiptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * The data needed to create a LorryReceipt.
     */
    data: XOR<LorryReceiptCreateInput, LorryReceiptUncheckedCreateInput>
  }

  /**
   * LorryReceipt createMany
   */
  export type LorryReceiptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LorryReceipts.
     */
    data: LorryReceiptCreateManyInput | LorryReceiptCreateManyInput[]
  }

  /**
   * LorryReceipt update
   */
  export type LorryReceiptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * The data needed to update a LorryReceipt.
     */
    data: XOR<LorryReceiptUpdateInput, LorryReceiptUncheckedUpdateInput>
    /**
     * Choose, which LorryReceipt to update.
     */
    where: LorryReceiptWhereUniqueInput
  }

  /**
   * LorryReceipt updateMany
   */
  export type LorryReceiptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LorryReceipts.
     */
    data: XOR<LorryReceiptUpdateManyMutationInput, LorryReceiptUncheckedUpdateManyInput>
    /**
     * Filter which LorryReceipts to update
     */
    where?: LorryReceiptWhereInput
    /**
     * Limit how many LorryReceipts to update.
     */
    limit?: number
  }

  /**
   * LorryReceipt upsert
   */
  export type LorryReceiptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * The filter to search for the LorryReceipt to update in case it exists.
     */
    where: LorryReceiptWhereUniqueInput
    /**
     * In case the LorryReceipt found by the `where` argument doesn't exist, create a new LorryReceipt with this data.
     */
    create: XOR<LorryReceiptCreateInput, LorryReceiptUncheckedCreateInput>
    /**
     * In case the LorryReceipt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LorryReceiptUpdateInput, LorryReceiptUncheckedUpdateInput>
  }

  /**
   * LorryReceipt delete
   */
  export type LorryReceiptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
    /**
     * Filter which LorryReceipt to delete.
     */
    where: LorryReceiptWhereUniqueInput
  }

  /**
   * LorryReceipt deleteMany
   */
  export type LorryReceiptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LorryReceipts to delete
     */
    where?: LorryReceiptWhereInput
    /**
     * Limit how many LorryReceipts to delete.
     */
    limit?: number
  }

  /**
   * LorryReceipt without action
   */
  export type LorryReceiptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LorryReceipt
     */
    select?: LorryReceiptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LorryReceipt
     */
    omit?: LorryReceiptOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable',
    Snapshot: 'Snapshot'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    role: 'role',
    banned: 'banned',
    banReason: 'banReason',
    banExpires: 'banExpires',
    phone: 'phone',
    companyId: 'companyId',
    vendorId: 'vendorId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VendorScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    name: 'name',
    contactEmail: 'contactEmail',
    contactPhone: 'contactPhone',
    gstNumber: 'gstNumber',
    panNumber: 'panNumber',
    profileCompleted: 'profileCompleted',
    taxId: 'taxId',
    paymentTerms: 'paymentTerms',
    isActive: 'isActive'
  };

  export type VendorScalarFieldEnum = (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    label: 'label',
    url: 'url',
    entryBy: 'entryBy',
    description: 'description',
    linkedId: 'linkedId'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const AddressScalarFieldEnum: {
    id: 'id',
    line1: 'line1',
    line2: 'line2',
    city: 'city',
    state: 'state',
    postal: 'postal',
    country: 'country',
    vendorId: 'vendorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AddressScalarFieldEnum = (typeof AddressScalarFieldEnum)[keyof typeof AddressScalarFieldEnum]


  export const LRRequestScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    vehicleType: 'vehicleType',
    vehicleNo: 'vehicleNo',
    CustomerName: 'CustomerName',
    LRNumber: 'LRNumber',
    origin: 'origin',
    destination: 'destination',
    outDate: 'outDate',
    status: 'status',
    priceOffered: 'priceOffered',
    priceSettled: 'priceSettled',
    extraCost: 'extraCost',
    fileNumber: 'fileNumber',
    remark: 'remark',
    isInvoiced: 'isInvoiced',
    podlink: 'podlink',
    tvendorId: 'tvendorId',
    invoiceId: 'invoiceId'
  };

  export type LRRequestScalarFieldEnum = (typeof LRRequestScalarFieldEnum)[keyof typeof LRRequestScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    invoiceNumber: 'invoiceNumber',
    refernceNumber: 'refernceNumber',
    invoiceDate: 'invoiceDate',
    vendorId: 'vendorId',
    poId: 'poId',
    status: 'status',
    subtotal: 'subtotal',
    taxRate: 'taxRate',
    taxAmount: 'taxAmount',
    grandTotal: 'grandTotal',
    notes: 'notes',
    hasDiscrepancy: 'hasDiscrepancy',
    discrepancyNotes: 'discrepancyNotes',
    billTo: 'billTo',
    billToId: 'billToId',
    billToGstin: 'billToGstin',
    invoiceURI: 'invoiceURI'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const InvoiceReferenceScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    from: 'from',
    to: 'to',
    dueDate: 'dueDate',
    paidDate: 'paidDate',
    refernceId: 'refernceId'
  };

  export type InvoiceReferenceScalarFieldEnum = (typeof InvoiceReferenceScalarFieldEnum)[keyof typeof InvoiceReferenceScalarFieldEnum]


  export const InvoiceItemScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    description: 'description',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    total: 'total',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvoiceItemScalarFieldEnum = (typeof InvoiceItemScalarFieldEnum)[keyof typeof InvoiceItemScalarFieldEnum]


  export const PurchaseOrderScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    poNumber: 'poNumber',
    poDate: 'poDate',
    status: 'status',
    subtotal: 'subtotal',
    taxRate: 'taxRate',
    taxAmount: 'taxAmount',
    grandTotal: 'grandTotal',
    notes: 'notes',
    attachments: 'attachments',
    deliveryDate: 'deliveryDate',
    deliveryAddress: 'deliveryAddress',
    invoiceCopy: 'invoiceCopy',
    vendorId: 'vendorId',
    userId: 'userId'
  };

  export type PurchaseOrderScalarFieldEnum = (typeof PurchaseOrderScalarFieldEnum)[keyof typeof PurchaseOrderScalarFieldEnum]


  export const PurchaseOrderItemScalarFieldEnum: {
    id: 'id',
    poId: 'poId',
    description: 'description',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    total: 'total',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PurchaseOrderItemScalarFieldEnum = (typeof PurchaseOrderItemScalarFieldEnum)[keyof typeof PurchaseOrderItemScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    expiresAt: 'expiresAt',
    token: 'token',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    impersonatedBy: 'impersonatedBy',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    accountId: 'accountId',
    providerId: 'providerId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    scope: 'scope',
    password: 'password',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    userId: 'userId'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const LorryReceiptScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lrNo: 'lrNo',
    lrDate: 'lrDate',
    city: 'city',
    transporter: 'transporter',
    warehouse: 'warehouse',
    vehicleType: 'vehicleType',
    vehicleNo: 'vehicleNo'
  };

  export type LorryReceiptScalarFieldEnum = (typeof LorryReceiptScalarFieldEnum)[keyof typeof LorryReceiptScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    phone?: StringNullableFilter<"User"> | string | null
    companyId?: StringNullableFilter<"User"> | string | null
    vendorId?: StringNullableFilter<"User"> | string | null
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    Vendor?: XOR<VendorNullableScalarRelationFilter, VendorWhereInput> | null
    PurchaseOrder?: PurchaseOrderListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    vendorId?: SortOrderInput | SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    Vendor?: VendorOrderByWithRelationInput
    PurchaseOrder?: PurchaseOrderOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    phone?: StringNullableFilter<"User"> | string | null
    companyId?: StringNullableFilter<"User"> | string | null
    vendorId?: StringNullableFilter<"User"> | string | null
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    Vendor?: XOR<VendorNullableScalarRelationFilter, VendorWhereInput> | null
    PurchaseOrder?: PurchaseOrderListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    companyId?: SortOrderInput | SortOrder
    vendorId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    banned?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    banReason?: StringNullableWithAggregatesFilter<"User"> | string | null
    banExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    companyId?: StringNullableWithAggregatesFilter<"User"> | string | null
    vendorId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type VendorWhereInput = {
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    id?: StringFilter<"Vendor"> | string
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    name?: StringFilter<"Vendor"> | string
    contactEmail?: StringNullableFilter<"Vendor"> | string | null
    contactPhone?: StringNullableFilter<"Vendor"> | string | null
    gstNumber?: StringNullableFilter<"Vendor"> | string | null
    panNumber?: StringNullableFilter<"Vendor"> | string | null
    profileCompleted?: BoolFilter<"Vendor"> | boolean
    taxId?: StringNullableFilter<"Vendor"> | string | null
    paymentTerms?: StringNullableFilter<"Vendor"> | string | null
    isActive?: BoolFilter<"Vendor"> | boolean
    users?: UserListRelationFilter
    invoices?: InvoiceListRelationFilter
    PurchaseOrder?: PurchaseOrderListRelationFilter
    Address?: AddressListRelationFilter
    LRRequest?: LRRequestListRelationFilter
  }

  export type VendorOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    gstNumber?: SortOrderInput | SortOrder
    panNumber?: SortOrderInput | SortOrder
    profileCompleted?: SortOrder
    taxId?: SortOrderInput | SortOrder
    paymentTerms?: SortOrderInput | SortOrder
    isActive?: SortOrder
    users?: UserOrderByRelationAggregateInput
    invoices?: InvoiceOrderByRelationAggregateInput
    PurchaseOrder?: PurchaseOrderOrderByRelationAggregateInput
    Address?: AddressOrderByRelationAggregateInput
    LRRequest?: LRRequestOrderByRelationAggregateInput
  }

  export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    name?: StringFilter<"Vendor"> | string
    contactEmail?: StringNullableFilter<"Vendor"> | string | null
    contactPhone?: StringNullableFilter<"Vendor"> | string | null
    gstNumber?: StringNullableFilter<"Vendor"> | string | null
    panNumber?: StringNullableFilter<"Vendor"> | string | null
    profileCompleted?: BoolFilter<"Vendor"> | boolean
    taxId?: StringNullableFilter<"Vendor"> | string | null
    paymentTerms?: StringNullableFilter<"Vendor"> | string | null
    isActive?: BoolFilter<"Vendor"> | boolean
    users?: UserListRelationFilter
    invoices?: InvoiceListRelationFilter
    PurchaseOrder?: PurchaseOrderListRelationFilter
    Address?: AddressListRelationFilter
    LRRequest?: LRRequestListRelationFilter
  }, "id">

  export type VendorOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    gstNumber?: SortOrderInput | SortOrder
    panNumber?: SortOrderInput | SortOrder
    profileCompleted?: SortOrder
    taxId?: SortOrderInput | SortOrder
    paymentTerms?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: VendorCountOrderByAggregateInput
    _max?: VendorMaxOrderByAggregateInput
    _min?: VendorMinOrderByAggregateInput
  }

  export type VendorScalarWhereWithAggregatesInput = {
    AND?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    OR?: VendorScalarWhereWithAggregatesInput[]
    NOT?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vendor"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
    name?: StringWithAggregatesFilter<"Vendor"> | string
    contactEmail?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    gstNumber?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    panNumber?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    profileCompleted?: BoolWithAggregatesFilter<"Vendor"> | boolean
    taxId?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    paymentTerms?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    isActive?: BoolWithAggregatesFilter<"Vendor"> | boolean
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    label?: StringFilter<"Document"> | string
    url?: StringNullableFilter<"Document"> | string | null
    entryBy?: StringNullableFilter<"Document"> | string | null
    description?: StringNullableFilter<"Document"> | string | null
    linkedId?: StringFilter<"Document"> | string
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    label?: SortOrder
    url?: SortOrderInput | SortOrder
    entryBy?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    linkedId?: SortOrder
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    linkedId?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    label?: StringFilter<"Document"> | string
    url?: StringNullableFilter<"Document"> | string | null
    entryBy?: StringNullableFilter<"Document"> | string | null
    description?: StringNullableFilter<"Document"> | string | null
  }, "id" | "linkedId">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    label?: SortOrder
    url?: SortOrderInput | SortOrder
    entryBy?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    linkedId?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    label?: StringWithAggregatesFilter<"Document"> | string
    url?: StringNullableWithAggregatesFilter<"Document"> | string | null
    entryBy?: StringNullableWithAggregatesFilter<"Document"> | string | null
    description?: StringNullableWithAggregatesFilter<"Document"> | string | null
    linkedId?: StringWithAggregatesFilter<"Document"> | string
  }

  export type AddressWhereInput = {
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    id?: StringFilter<"Address"> | string
    line1?: StringFilter<"Address"> | string
    line2?: StringNullableFilter<"Address"> | string | null
    city?: StringFilter<"Address"> | string
    state?: StringNullableFilter<"Address"> | string | null
    postal?: StringNullableFilter<"Address"> | string | null
    country?: StringFilter<"Address"> | string
    vendorId?: StringFilter<"Address"> | string
    createdAt?: DateTimeFilter<"Address"> | Date | string
    updatedAt?: DateTimeFilter<"Address"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }

  export type AddressOrderByWithRelationInput = {
    id?: SortOrder
    line1?: SortOrder
    line2?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrderInput | SortOrder
    postal?: SortOrderInput | SortOrder
    country?: SortOrder
    vendorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vendor?: VendorOrderByWithRelationInput
  }

  export type AddressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    vendorId?: string
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    line1?: StringFilter<"Address"> | string
    line2?: StringNullableFilter<"Address"> | string | null
    city?: StringFilter<"Address"> | string
    state?: StringNullableFilter<"Address"> | string | null
    postal?: StringNullableFilter<"Address"> | string | null
    country?: StringFilter<"Address"> | string
    createdAt?: DateTimeFilter<"Address"> | Date | string
    updatedAt?: DateTimeFilter<"Address"> | Date | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }, "id" | "vendorId">

  export type AddressOrderByWithAggregationInput = {
    id?: SortOrder
    line1?: SortOrder
    line2?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrderInput | SortOrder
    postal?: SortOrderInput | SortOrder
    country?: SortOrder
    vendorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AddressCountOrderByAggregateInput
    _max?: AddressMaxOrderByAggregateInput
    _min?: AddressMinOrderByAggregateInput
  }

  export type AddressScalarWhereWithAggregatesInput = {
    AND?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    OR?: AddressScalarWhereWithAggregatesInput[]
    NOT?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Address"> | string
    line1?: StringWithAggregatesFilter<"Address"> | string
    line2?: StringNullableWithAggregatesFilter<"Address"> | string | null
    city?: StringWithAggregatesFilter<"Address"> | string
    state?: StringNullableWithAggregatesFilter<"Address"> | string | null
    postal?: StringNullableWithAggregatesFilter<"Address"> | string | null
    country?: StringWithAggregatesFilter<"Address"> | string
    vendorId?: StringWithAggregatesFilter<"Address"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Address"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Address"> | Date | string
  }

  export type LRRequestWhereInput = {
    AND?: LRRequestWhereInput | LRRequestWhereInput[]
    OR?: LRRequestWhereInput[]
    NOT?: LRRequestWhereInput | LRRequestWhereInput[]
    id?: StringFilter<"LRRequest"> | string
    createdAt?: DateTimeFilter<"LRRequest"> | Date | string
    updatedAt?: DateTimeFilter<"LRRequest"> | Date | string
    vehicleType?: StringNullableFilter<"LRRequest"> | string | null
    vehicleNo?: StringNullableFilter<"LRRequest"> | string | null
    CustomerName?: StringNullableFilter<"LRRequest"> | string | null
    LRNumber?: StringFilter<"LRRequest"> | string
    origin?: StringNullableFilter<"LRRequest"> | string | null
    destination?: StringNullableFilter<"LRRequest"> | string | null
    outDate?: DateTimeFilter<"LRRequest"> | Date | string
    status?: StringNullableFilter<"LRRequest"> | string | null
    priceOffered?: FloatNullableFilter<"LRRequest"> | number | null
    priceSettled?: FloatNullableFilter<"LRRequest"> | number | null
    extraCost?: FloatNullableFilter<"LRRequest"> | number | null
    fileNumber?: StringFilter<"LRRequest"> | string
    remark?: StringNullableFilter<"LRRequest"> | string | null
    isInvoiced?: BoolFilter<"LRRequest"> | boolean
    podlink?: StringNullableFilter<"LRRequest"> | string | null
    tvendorId?: StringFilter<"LRRequest"> | string
    invoiceId?: StringNullableFilter<"LRRequest"> | string | null
    tvendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    Invoice?: XOR<InvoiceNullableScalarRelationFilter, InvoiceWhereInput> | null
  }

  export type LRRequestOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicleType?: SortOrderInput | SortOrder
    vehicleNo?: SortOrderInput | SortOrder
    CustomerName?: SortOrderInput | SortOrder
    LRNumber?: SortOrder
    origin?: SortOrderInput | SortOrder
    destination?: SortOrderInput | SortOrder
    outDate?: SortOrder
    status?: SortOrderInput | SortOrder
    priceOffered?: SortOrderInput | SortOrder
    priceSettled?: SortOrderInput | SortOrder
    extraCost?: SortOrderInput | SortOrder
    fileNumber?: SortOrder
    remark?: SortOrderInput | SortOrder
    isInvoiced?: SortOrder
    podlink?: SortOrderInput | SortOrder
    tvendorId?: SortOrder
    invoiceId?: SortOrderInput | SortOrder
    tvendor?: VendorOrderByWithRelationInput
    Invoice?: InvoiceOrderByWithRelationInput
  }

  export type LRRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    LRNumber?: string
    AND?: LRRequestWhereInput | LRRequestWhereInput[]
    OR?: LRRequestWhereInput[]
    NOT?: LRRequestWhereInput | LRRequestWhereInput[]
    createdAt?: DateTimeFilter<"LRRequest"> | Date | string
    updatedAt?: DateTimeFilter<"LRRequest"> | Date | string
    vehicleType?: StringNullableFilter<"LRRequest"> | string | null
    vehicleNo?: StringNullableFilter<"LRRequest"> | string | null
    CustomerName?: StringNullableFilter<"LRRequest"> | string | null
    origin?: StringNullableFilter<"LRRequest"> | string | null
    destination?: StringNullableFilter<"LRRequest"> | string | null
    outDate?: DateTimeFilter<"LRRequest"> | Date | string
    status?: StringNullableFilter<"LRRequest"> | string | null
    priceOffered?: FloatNullableFilter<"LRRequest"> | number | null
    priceSettled?: FloatNullableFilter<"LRRequest"> | number | null
    extraCost?: FloatNullableFilter<"LRRequest"> | number | null
    fileNumber?: StringFilter<"LRRequest"> | string
    remark?: StringNullableFilter<"LRRequest"> | string | null
    isInvoiced?: BoolFilter<"LRRequest"> | boolean
    podlink?: StringNullableFilter<"LRRequest"> | string | null
    tvendorId?: StringFilter<"LRRequest"> | string
    invoiceId?: StringNullableFilter<"LRRequest"> | string | null
    tvendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    Invoice?: XOR<InvoiceNullableScalarRelationFilter, InvoiceWhereInput> | null
  }, "id" | "LRNumber">

  export type LRRequestOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicleType?: SortOrderInput | SortOrder
    vehicleNo?: SortOrderInput | SortOrder
    CustomerName?: SortOrderInput | SortOrder
    LRNumber?: SortOrder
    origin?: SortOrderInput | SortOrder
    destination?: SortOrderInput | SortOrder
    outDate?: SortOrder
    status?: SortOrderInput | SortOrder
    priceOffered?: SortOrderInput | SortOrder
    priceSettled?: SortOrderInput | SortOrder
    extraCost?: SortOrderInput | SortOrder
    fileNumber?: SortOrder
    remark?: SortOrderInput | SortOrder
    isInvoiced?: SortOrder
    podlink?: SortOrderInput | SortOrder
    tvendorId?: SortOrder
    invoiceId?: SortOrderInput | SortOrder
    _count?: LRRequestCountOrderByAggregateInput
    _avg?: LRRequestAvgOrderByAggregateInput
    _max?: LRRequestMaxOrderByAggregateInput
    _min?: LRRequestMinOrderByAggregateInput
    _sum?: LRRequestSumOrderByAggregateInput
  }

  export type LRRequestScalarWhereWithAggregatesInput = {
    AND?: LRRequestScalarWhereWithAggregatesInput | LRRequestScalarWhereWithAggregatesInput[]
    OR?: LRRequestScalarWhereWithAggregatesInput[]
    NOT?: LRRequestScalarWhereWithAggregatesInput | LRRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LRRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LRRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LRRequest"> | Date | string
    vehicleType?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    vehicleNo?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    CustomerName?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    LRNumber?: StringWithAggregatesFilter<"LRRequest"> | string
    origin?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    destination?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    outDate?: DateTimeWithAggregatesFilter<"LRRequest"> | Date | string
    status?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    priceOffered?: FloatNullableWithAggregatesFilter<"LRRequest"> | number | null
    priceSettled?: FloatNullableWithAggregatesFilter<"LRRequest"> | number | null
    extraCost?: FloatNullableWithAggregatesFilter<"LRRequest"> | number | null
    fileNumber?: StringWithAggregatesFilter<"LRRequest"> | string
    remark?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    isInvoiced?: BoolWithAggregatesFilter<"LRRequest"> | boolean
    podlink?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
    tvendorId?: StringWithAggregatesFilter<"LRRequest"> | string
    invoiceId?: StringNullableWithAggregatesFilter<"LRRequest"> | string | null
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    invoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    refernceNumber?: StringFilter<"Invoice"> | string
    invoiceDate?: DateTimeFilter<"Invoice"> | Date | string
    vendorId?: StringFilter<"Invoice"> | string
    poId?: StringNullableFilter<"Invoice"> | string | null
    status?: StringFilter<"Invoice"> | string
    subtotal?: FloatFilter<"Invoice"> | number
    taxRate?: FloatFilter<"Invoice"> | number
    taxAmount?: FloatFilter<"Invoice"> | number
    grandTotal?: FloatFilter<"Invoice"> | number
    notes?: StringNullableFilter<"Invoice"> | string | null
    hasDiscrepancy?: BoolFilter<"Invoice"> | boolean
    discrepancyNotes?: StringNullableFilter<"Invoice"> | string | null
    billTo?: StringNullableFilter<"Invoice"> | string | null
    billToId?: StringNullableFilter<"Invoice"> | string | null
    billToGstin?: StringNullableFilter<"Invoice"> | string | null
    invoiceURI?: StringNullableFilter<"Invoice"> | string | null
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    purchaseOrder?: XOR<PurchaseOrderNullableScalarRelationFilter, PurchaseOrderWhereInput> | null
    items?: InvoiceItemListRelationFilter
    LRRequest?: LRRequestListRelationFilter
    InvoiceReference?: InvoiceReferenceListRelationFilter
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    refernceNumber?: SortOrder
    invoiceDate?: SortOrder
    vendorId?: SortOrder
    poId?: SortOrderInput | SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrderInput | SortOrder
    hasDiscrepancy?: SortOrder
    discrepancyNotes?: SortOrderInput | SortOrder
    billTo?: SortOrderInput | SortOrder
    billToId?: SortOrderInput | SortOrder
    billToGstin?: SortOrderInput | SortOrder
    invoiceURI?: SortOrderInput | SortOrder
    vendor?: VendorOrderByWithRelationInput
    purchaseOrder?: PurchaseOrderOrderByWithRelationInput
    items?: InvoiceItemOrderByRelationAggregateInput
    LRRequest?: LRRequestOrderByRelationAggregateInput
    InvoiceReference?: InvoiceReferenceOrderByRelationAggregateInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    refernceNumber?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    invoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    invoiceDate?: DateTimeFilter<"Invoice"> | Date | string
    vendorId?: StringFilter<"Invoice"> | string
    poId?: StringNullableFilter<"Invoice"> | string | null
    status?: StringFilter<"Invoice"> | string
    subtotal?: FloatFilter<"Invoice"> | number
    taxRate?: FloatFilter<"Invoice"> | number
    taxAmount?: FloatFilter<"Invoice"> | number
    grandTotal?: FloatFilter<"Invoice"> | number
    notes?: StringNullableFilter<"Invoice"> | string | null
    hasDiscrepancy?: BoolFilter<"Invoice"> | boolean
    discrepancyNotes?: StringNullableFilter<"Invoice"> | string | null
    billTo?: StringNullableFilter<"Invoice"> | string | null
    billToId?: StringNullableFilter<"Invoice"> | string | null
    billToGstin?: StringNullableFilter<"Invoice"> | string | null
    invoiceURI?: StringNullableFilter<"Invoice"> | string | null
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    purchaseOrder?: XOR<PurchaseOrderNullableScalarRelationFilter, PurchaseOrderWhereInput> | null
    items?: InvoiceItemListRelationFilter
    LRRequest?: LRRequestListRelationFilter
    InvoiceReference?: InvoiceReferenceListRelationFilter
  }, "id" | "refernceNumber">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    refernceNumber?: SortOrder
    invoiceDate?: SortOrder
    vendorId?: SortOrder
    poId?: SortOrderInput | SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrderInput | SortOrder
    hasDiscrepancy?: SortOrder
    discrepancyNotes?: SortOrderInput | SortOrder
    billTo?: SortOrderInput | SortOrder
    billToId?: SortOrderInput | SortOrder
    billToGstin?: SortOrderInput | SortOrder
    invoiceURI?: SortOrderInput | SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    invoiceNumber?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    refernceNumber?: StringWithAggregatesFilter<"Invoice"> | string
    invoiceDate?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    vendorId?: StringWithAggregatesFilter<"Invoice"> | string
    poId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    status?: StringWithAggregatesFilter<"Invoice"> | string
    subtotal?: FloatWithAggregatesFilter<"Invoice"> | number
    taxRate?: FloatWithAggregatesFilter<"Invoice"> | number
    taxAmount?: FloatWithAggregatesFilter<"Invoice"> | number
    grandTotal?: FloatWithAggregatesFilter<"Invoice"> | number
    notes?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    hasDiscrepancy?: BoolWithAggregatesFilter<"Invoice"> | boolean
    discrepancyNotes?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billTo?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billToId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billToGstin?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    invoiceURI?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
  }

  export type InvoiceReferenceWhereInput = {
    AND?: InvoiceReferenceWhereInput | InvoiceReferenceWhereInput[]
    OR?: InvoiceReferenceWhereInput[]
    NOT?: InvoiceReferenceWhereInput | InvoiceReferenceWhereInput[]
    id?: StringFilter<"InvoiceReference"> | string
    createdAt?: DateTimeFilter<"InvoiceReference"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceReference"> | Date | string
    from?: DateTimeFilter<"InvoiceReference"> | Date | string
    to?: DateTimeFilter<"InvoiceReference"> | Date | string
    dueDate?: DateTimeNullableFilter<"InvoiceReference"> | Date | string | null
    paidDate?: DateTimeNullableFilter<"InvoiceReference"> | Date | string | null
    refernceId?: StringFilter<"InvoiceReference"> | string
    invoiceRefernce?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }

  export type InvoiceReferenceOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    from?: SortOrder
    to?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    paidDate?: SortOrderInput | SortOrder
    refernceId?: SortOrder
    invoiceRefernce?: InvoiceOrderByWithRelationInput
  }

  export type InvoiceReferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceReferenceWhereInput | InvoiceReferenceWhereInput[]
    OR?: InvoiceReferenceWhereInput[]
    NOT?: InvoiceReferenceWhereInput | InvoiceReferenceWhereInput[]
    createdAt?: DateTimeFilter<"InvoiceReference"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceReference"> | Date | string
    from?: DateTimeFilter<"InvoiceReference"> | Date | string
    to?: DateTimeFilter<"InvoiceReference"> | Date | string
    dueDate?: DateTimeNullableFilter<"InvoiceReference"> | Date | string | null
    paidDate?: DateTimeNullableFilter<"InvoiceReference"> | Date | string | null
    refernceId?: StringFilter<"InvoiceReference"> | string
    invoiceRefernce?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }, "id">

  export type InvoiceReferenceOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    from?: SortOrder
    to?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    paidDate?: SortOrderInput | SortOrder
    refernceId?: SortOrder
    _count?: InvoiceReferenceCountOrderByAggregateInput
    _max?: InvoiceReferenceMaxOrderByAggregateInput
    _min?: InvoiceReferenceMinOrderByAggregateInput
  }

  export type InvoiceReferenceScalarWhereWithAggregatesInput = {
    AND?: InvoiceReferenceScalarWhereWithAggregatesInput | InvoiceReferenceScalarWhereWithAggregatesInput[]
    OR?: InvoiceReferenceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceReferenceScalarWhereWithAggregatesInput | InvoiceReferenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvoiceReference"> | string
    createdAt?: DateTimeWithAggregatesFilter<"InvoiceReference"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InvoiceReference"> | Date | string
    from?: DateTimeWithAggregatesFilter<"InvoiceReference"> | Date | string
    to?: DateTimeWithAggregatesFilter<"InvoiceReference"> | Date | string
    dueDate?: DateTimeNullableWithAggregatesFilter<"InvoiceReference"> | Date | string | null
    paidDate?: DateTimeNullableWithAggregatesFilter<"InvoiceReference"> | Date | string | null
    refernceId?: StringWithAggregatesFilter<"InvoiceReference"> | string
  }

  export type InvoiceItemWhereInput = {
    AND?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    OR?: InvoiceItemWhereInput[]
    NOT?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    id?: StringFilter<"InvoiceItem"> | string
    invoiceId?: StringFilter<"InvoiceItem"> | string
    description?: StringFilter<"InvoiceItem"> | string
    quantity?: IntFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    total?: FloatFilter<"InvoiceItem"> | number
    notes?: StringNullableFilter<"InvoiceItem"> | string | null
    createdAt?: DateTimeFilter<"InvoiceItem"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceItem"> | Date | string
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }

  export type InvoiceItemOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoice?: InvoiceOrderByWithRelationInput
  }

  export type InvoiceItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    OR?: InvoiceItemWhereInput[]
    NOT?: InvoiceItemWhereInput | InvoiceItemWhereInput[]
    invoiceId?: StringFilter<"InvoiceItem"> | string
    description?: StringFilter<"InvoiceItem"> | string
    quantity?: IntFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    total?: FloatFilter<"InvoiceItem"> | number
    notes?: StringNullableFilter<"InvoiceItem"> | string | null
    createdAt?: DateTimeFilter<"InvoiceItem"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceItem"> | Date | string
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }, "id">

  export type InvoiceItemOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvoiceItemCountOrderByAggregateInput
    _avg?: InvoiceItemAvgOrderByAggregateInput
    _max?: InvoiceItemMaxOrderByAggregateInput
    _min?: InvoiceItemMinOrderByAggregateInput
    _sum?: InvoiceItemSumOrderByAggregateInput
  }

  export type InvoiceItemScalarWhereWithAggregatesInput = {
    AND?: InvoiceItemScalarWhereWithAggregatesInput | InvoiceItemScalarWhereWithAggregatesInput[]
    OR?: InvoiceItemScalarWhereWithAggregatesInput[]
    NOT?: InvoiceItemScalarWhereWithAggregatesInput | InvoiceItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvoiceItem"> | string
    invoiceId?: StringWithAggregatesFilter<"InvoiceItem"> | string
    description?: StringWithAggregatesFilter<"InvoiceItem"> | string
    quantity?: IntWithAggregatesFilter<"InvoiceItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    total?: FloatWithAggregatesFilter<"InvoiceItem"> | number
    notes?: StringNullableWithAggregatesFilter<"InvoiceItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InvoiceItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InvoiceItem"> | Date | string
  }

  export type PurchaseOrderWhereInput = {
    AND?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    OR?: PurchaseOrderWhereInput[]
    NOT?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    id?: StringFilter<"PurchaseOrder"> | string
    createdAt?: DateTimeFilter<"PurchaseOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrder"> | Date | string
    poNumber?: StringFilter<"PurchaseOrder"> | string
    poDate?: DateTimeFilter<"PurchaseOrder"> | Date | string
    status?: StringFilter<"PurchaseOrder"> | string
    subtotal?: FloatFilter<"PurchaseOrder"> | number
    taxRate?: FloatFilter<"PurchaseOrder"> | number
    taxAmount?: FloatFilter<"PurchaseOrder"> | number
    grandTotal?: FloatFilter<"PurchaseOrder"> | number
    notes?: StringNullableFilter<"PurchaseOrder"> | string | null
    attachments?: StringNullableFilter<"PurchaseOrder"> | string | null
    deliveryDate?: DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null
    deliveryAddress?: StringNullableFilter<"PurchaseOrder"> | string | null
    invoiceCopy?: StringNullableFilter<"PurchaseOrder"> | string | null
    vendorId?: StringFilter<"PurchaseOrder"> | string
    userId?: StringFilter<"PurchaseOrder"> | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: PurchaseOrderItemListRelationFilter
    invoices?: InvoiceListRelationFilter
  }

  export type PurchaseOrderOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    poNumber?: SortOrder
    poDate?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    deliveryAddress?: SortOrderInput | SortOrder
    invoiceCopy?: SortOrderInput | SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
    vendor?: VendorOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    items?: PurchaseOrderItemOrderByRelationAggregateInput
    invoices?: InvoiceOrderByRelationAggregateInput
  }

  export type PurchaseOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    poNumber?: string
    AND?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    OR?: PurchaseOrderWhereInput[]
    NOT?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    createdAt?: DateTimeFilter<"PurchaseOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrder"> | Date | string
    poDate?: DateTimeFilter<"PurchaseOrder"> | Date | string
    status?: StringFilter<"PurchaseOrder"> | string
    subtotal?: FloatFilter<"PurchaseOrder"> | number
    taxRate?: FloatFilter<"PurchaseOrder"> | number
    taxAmount?: FloatFilter<"PurchaseOrder"> | number
    grandTotal?: FloatFilter<"PurchaseOrder"> | number
    notes?: StringNullableFilter<"PurchaseOrder"> | string | null
    attachments?: StringNullableFilter<"PurchaseOrder"> | string | null
    deliveryDate?: DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null
    deliveryAddress?: StringNullableFilter<"PurchaseOrder"> | string | null
    invoiceCopy?: StringNullableFilter<"PurchaseOrder"> | string | null
    vendorId?: StringFilter<"PurchaseOrder"> | string
    userId?: StringFilter<"PurchaseOrder"> | string
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: PurchaseOrderItemListRelationFilter
    invoices?: InvoiceListRelationFilter
  }, "id" | "poNumber">

  export type PurchaseOrderOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    poNumber?: SortOrder
    poDate?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    deliveryAddress?: SortOrderInput | SortOrder
    invoiceCopy?: SortOrderInput | SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
    _count?: PurchaseOrderCountOrderByAggregateInput
    _avg?: PurchaseOrderAvgOrderByAggregateInput
    _max?: PurchaseOrderMaxOrderByAggregateInput
    _min?: PurchaseOrderMinOrderByAggregateInput
    _sum?: PurchaseOrderSumOrderByAggregateInput
  }

  export type PurchaseOrderScalarWhereWithAggregatesInput = {
    AND?: PurchaseOrderScalarWhereWithAggregatesInput | PurchaseOrderScalarWhereWithAggregatesInput[]
    OR?: PurchaseOrderScalarWhereWithAggregatesInput[]
    NOT?: PurchaseOrderScalarWhereWithAggregatesInput | PurchaseOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PurchaseOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PurchaseOrder"> | Date | string
    poNumber?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    poDate?: DateTimeWithAggregatesFilter<"PurchaseOrder"> | Date | string
    status?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    subtotal?: FloatWithAggregatesFilter<"PurchaseOrder"> | number
    taxRate?: FloatWithAggregatesFilter<"PurchaseOrder"> | number
    taxAmount?: FloatWithAggregatesFilter<"PurchaseOrder"> | number
    grandTotal?: FloatWithAggregatesFilter<"PurchaseOrder"> | number
    notes?: StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null
    attachments?: StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null
    deliveryDate?: DateTimeNullableWithAggregatesFilter<"PurchaseOrder"> | Date | string | null
    deliveryAddress?: StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null
    invoiceCopy?: StringNullableWithAggregatesFilter<"PurchaseOrder"> | string | null
    vendorId?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    userId?: StringWithAggregatesFilter<"PurchaseOrder"> | string
  }

  export type PurchaseOrderItemWhereInput = {
    AND?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    OR?: PurchaseOrderItemWhereInput[]
    NOT?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    id?: StringFilter<"PurchaseOrderItem"> | string
    poId?: StringFilter<"PurchaseOrderItem"> | string
    description?: StringFilter<"PurchaseOrderItem"> | string
    quantity?: IntFilter<"PurchaseOrderItem"> | number
    unitPrice?: FloatFilter<"PurchaseOrderItem"> | number
    total?: FloatFilter<"PurchaseOrderItem"> | number
    notes?: StringNullableFilter<"PurchaseOrderItem"> | string | null
    createdAt?: DateTimeFilter<"PurchaseOrderItem"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrderItem"> | Date | string
    purchaseOrder?: XOR<PurchaseOrderScalarRelationFilter, PurchaseOrderWhereInput>
  }

  export type PurchaseOrderItemOrderByWithRelationInput = {
    id?: SortOrder
    poId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    purchaseOrder?: PurchaseOrderOrderByWithRelationInput
  }

  export type PurchaseOrderItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    OR?: PurchaseOrderItemWhereInput[]
    NOT?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    poId?: StringFilter<"PurchaseOrderItem"> | string
    description?: StringFilter<"PurchaseOrderItem"> | string
    quantity?: IntFilter<"PurchaseOrderItem"> | number
    unitPrice?: FloatFilter<"PurchaseOrderItem"> | number
    total?: FloatFilter<"PurchaseOrderItem"> | number
    notes?: StringNullableFilter<"PurchaseOrderItem"> | string | null
    createdAt?: DateTimeFilter<"PurchaseOrderItem"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrderItem"> | Date | string
    purchaseOrder?: XOR<PurchaseOrderScalarRelationFilter, PurchaseOrderWhereInput>
  }, "id">

  export type PurchaseOrderItemOrderByWithAggregationInput = {
    id?: SortOrder
    poId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PurchaseOrderItemCountOrderByAggregateInput
    _avg?: PurchaseOrderItemAvgOrderByAggregateInput
    _max?: PurchaseOrderItemMaxOrderByAggregateInput
    _min?: PurchaseOrderItemMinOrderByAggregateInput
    _sum?: PurchaseOrderItemSumOrderByAggregateInput
  }

  export type PurchaseOrderItemScalarWhereWithAggregatesInput = {
    AND?: PurchaseOrderItemScalarWhereWithAggregatesInput | PurchaseOrderItemScalarWhereWithAggregatesInput[]
    OR?: PurchaseOrderItemScalarWhereWithAggregatesInput[]
    NOT?: PurchaseOrderItemScalarWhereWithAggregatesInput | PurchaseOrderItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PurchaseOrderItem"> | string
    poId?: StringWithAggregatesFilter<"PurchaseOrderItem"> | string
    description?: StringWithAggregatesFilter<"PurchaseOrderItem"> | string
    quantity?: IntWithAggregatesFilter<"PurchaseOrderItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"PurchaseOrderItem"> | number
    total?: FloatWithAggregatesFilter<"PurchaseOrderItem"> | number
    notes?: StringNullableWithAggregatesFilter<"PurchaseOrderItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PurchaseOrderItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PurchaseOrderItem"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    impersonatedBy?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    userId?: StringFilter<"Account"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    userId?: StringFilter<"Account"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    userId?: StringWithAggregatesFilter<"Account"> | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type LorryReceiptWhereInput = {
    AND?: LorryReceiptWhereInput | LorryReceiptWhereInput[]
    OR?: LorryReceiptWhereInput[]
    NOT?: LorryReceiptWhereInput | LorryReceiptWhereInput[]
    id?: StringFilter<"LorryReceipt"> | string
    createdAt?: DateTimeFilter<"LorryReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"LorryReceipt"> | Date | string
    lrNo?: StringFilter<"LorryReceipt"> | string
    lrDate?: StringFilter<"LorryReceipt"> | string
    city?: StringFilter<"LorryReceipt"> | string
    transporter?: StringFilter<"LorryReceipt"> | string
    warehouse?: StringFilter<"LorryReceipt"> | string
    vehicleType?: StringFilter<"LorryReceipt"> | string
    vehicleNo?: StringFilter<"LorryReceipt"> | string
  }

  export type LorryReceiptOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lrNo?: SortOrder
    lrDate?: SortOrder
    city?: SortOrder
    transporter?: SortOrder
    warehouse?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
  }

  export type LorryReceiptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    lrNo?: string
    AND?: LorryReceiptWhereInput | LorryReceiptWhereInput[]
    OR?: LorryReceiptWhereInput[]
    NOT?: LorryReceiptWhereInput | LorryReceiptWhereInput[]
    createdAt?: DateTimeFilter<"LorryReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"LorryReceipt"> | Date | string
    lrDate?: StringFilter<"LorryReceipt"> | string
    city?: StringFilter<"LorryReceipt"> | string
    transporter?: StringFilter<"LorryReceipt"> | string
    warehouse?: StringFilter<"LorryReceipt"> | string
    vehicleType?: StringFilter<"LorryReceipt"> | string
    vehicleNo?: StringFilter<"LorryReceipt"> | string
  }, "id" | "lrNo">

  export type LorryReceiptOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lrNo?: SortOrder
    lrDate?: SortOrder
    city?: SortOrder
    transporter?: SortOrder
    warehouse?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
    _count?: LorryReceiptCountOrderByAggregateInput
    _max?: LorryReceiptMaxOrderByAggregateInput
    _min?: LorryReceiptMinOrderByAggregateInput
  }

  export type LorryReceiptScalarWhereWithAggregatesInput = {
    AND?: LorryReceiptScalarWhereWithAggregatesInput | LorryReceiptScalarWhereWithAggregatesInput[]
    OR?: LorryReceiptScalarWhereWithAggregatesInput[]
    NOT?: LorryReceiptScalarWhereWithAggregatesInput | LorryReceiptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LorryReceipt"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LorryReceipt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LorryReceipt"> | Date | string
    lrNo?: StringWithAggregatesFilter<"LorryReceipt"> | string
    lrDate?: StringWithAggregatesFilter<"LorryReceipt"> | string
    city?: StringWithAggregatesFilter<"LorryReceipt"> | string
    transporter?: StringWithAggregatesFilter<"LorryReceipt"> | string
    warehouse?: StringWithAggregatesFilter<"LorryReceipt"> | string
    vehicleType?: StringWithAggregatesFilter<"LorryReceipt"> | string
    vehicleNo?: StringWithAggregatesFilter<"LorryReceipt"> | string
  }

  export type UserCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    Vendor?: VendorCreateNestedOneWithoutUsersInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    vendorId?: string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    Vendor?: VendorUpdateOneWithoutUsersNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    vendorId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VendorCreateInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserCreateNestedManyWithoutVendorInput
    invoices?: InvoiceCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutVendorInput
    Address?: AddressCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestCreateNestedManyWithoutTvendorInput
  }

  export type VendorUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutVendorInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput
    Address?: AddressUncheckedCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutTvendorInput
  }

  export type VendorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutVendorNestedInput
    Address?: AddressUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUpdateManyWithoutTvendorNestedInput
  }

  export type VendorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput
    Address?: AddressUncheckedUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutTvendorNestedInput
  }

  export type VendorCreateManyInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
  }

  export type VendorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DocumentCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    label: string
    url?: string | null
    entryBy?: string | null
    description?: string | null
    linkedId: string
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    label: string
    url?: string | null
    entryBy?: string | null
    description?: string | null
    linkedId: string
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    entryBy?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    linkedId?: StringFieldUpdateOperationsInput | string
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    entryBy?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    linkedId?: StringFieldUpdateOperationsInput | string
  }

  export type DocumentCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    label: string
    url?: string | null
    entryBy?: string | null
    description?: string | null
    linkedId: string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    entryBy?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    linkedId?: StringFieldUpdateOperationsInput | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    entryBy?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    linkedId?: StringFieldUpdateOperationsInput | string
  }

  export type AddressCreateInput = {
    id?: string
    line1: string
    line2?: string | null
    city: string
    state?: string | null
    postal?: string | null
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vendor: VendorCreateNestedOneWithoutAddressInput
  }

  export type AddressUncheckedCreateInput = {
    id?: string
    line1: string
    line2?: string | null
    city: string
    state?: string | null
    postal?: string | null
    country: string
    vendorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: StringFieldUpdateOperationsInput | string
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendor?: VendorUpdateOneRequiredWithoutAddressNestedInput
  }

  export type AddressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: StringFieldUpdateOperationsInput | string
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressCreateManyInput = {
    id?: string
    line1: string
    line2?: string | null
    city: string
    state?: string | null
    postal?: string | null
    country: string
    vendorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: StringFieldUpdateOperationsInput | string
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: StringFieldUpdateOperationsInput | string
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LRRequestCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    tvendor: VendorCreateNestedOneWithoutLRRequestInput
    Invoice?: InvoiceCreateNestedOneWithoutLRRequestInput
  }

  export type LRRequestUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    tvendorId: string
    invoiceId?: string | null
  }

  export type LRRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    tvendor?: VendorUpdateOneRequiredWithoutLRRequestNestedInput
    Invoice?: InvoiceUpdateOneWithoutLRRequestNestedInput
  }

  export type LRRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    tvendorId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LRRequestCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    tvendorId: string
    invoiceId?: string | null
  }

  export type LRRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LRRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    tvendorId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    vendor: VendorCreateNestedOneWithoutInvoicesInput
    purchaseOrder?: PurchaseOrderCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    vendorId: string
    poId?: string | null
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceUncheckedCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutInvoicesNestedInput
    purchaseOrder?: PurchaseOrderUpdateOneWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: StringFieldUpdateOperationsInput | string
    poId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    vendorId: string
    poId?: string | null
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: StringFieldUpdateOperationsInput | string
    poId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceReferenceCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    from: Date | string
    to: Date | string
    dueDate?: Date | string | null
    paidDate?: Date | string | null
    invoiceRefernce: InvoiceCreateNestedOneWithoutInvoiceReferenceInput
  }

  export type InvoiceReferenceUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    from: Date | string
    to: Date | string
    dueDate?: Date | string | null
    paidDate?: Date | string | null
    refernceId: string
  }

  export type InvoiceReferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceRefernce?: InvoiceUpdateOneRequiredWithoutInvoiceReferenceNestedInput
  }

  export type InvoiceReferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refernceId?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceReferenceCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    from: Date | string
    to: Date | string
    dueDate?: Date | string | null
    paidDate?: Date | string | null
    refernceId: string
  }

  export type InvoiceReferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceReferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refernceId?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceItemCreateInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoice: InvoiceCreateNestedOneWithoutItemsInput
  }

  export type InvoiceItemUncheckedCreateInput = {
    id?: string
    invoiceId: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: InvoiceUpdateOneRequiredWithoutItemsNestedInput
  }

  export type InvoiceItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemCreateManyInput = {
    id?: string
    invoiceId: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendor: VendorCreateNestedOneWithoutPurchaseOrderInput
    user: UserCreateNestedOneWithoutPurchaseOrderInput
    items?: PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput
    invoices?: InvoiceCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendorId: string
    userId: string
    items?: PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutPurchaseOrderNestedInput
    user?: UserUpdateOneRequiredWithoutPurchaseOrderNestedInput
    items?: PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput
    invoices?: InvoiceUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    items?: PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendorId: string
    userId: string
  }

  export type PurchaseOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PurchaseOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PurchaseOrderItemCreateInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    purchaseOrder: PurchaseOrderCreateNestedOneWithoutItemsInput
  }

  export type PurchaseOrderItemUncheckedCreateInput = {
    id?: string
    poId: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseOrderItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchaseOrder?: PurchaseOrderUpdateOneRequiredWithoutItemsNestedInput
  }

  export type PurchaseOrderItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    poId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderItemCreateManyInput = {
    id?: string
    poId: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseOrderItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    poId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    scope?: string | null
    password?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    scope?: string | null
    password?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    userId: string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    scope?: string | null
    password?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    userId: string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type VerificationCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    identifier: string
    value: string
    expiresAt: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    identifier: string
    value: string
    expiresAt: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    identifier: string
    value: string
    expiresAt: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LorryReceiptCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lrNo: string
    lrDate: string
    city: string
    transporter: string
    warehouse: string
    vehicleType: string
    vehicleNo: string
  }

  export type LorryReceiptUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lrNo: string
    lrDate: string
    city: string
    transporter: string
    warehouse: string
    vehicleType: string
    vehicleNo: string
  }

  export type LorryReceiptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lrNo?: StringFieldUpdateOperationsInput | string
    lrDate?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    transporter?: StringFieldUpdateOperationsInput | string
    warehouse?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    vehicleNo?: StringFieldUpdateOperationsInput | string
  }

  export type LorryReceiptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lrNo?: StringFieldUpdateOperationsInput | string
    lrDate?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    transporter?: StringFieldUpdateOperationsInput | string
    warehouse?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    vehicleNo?: StringFieldUpdateOperationsInput | string
  }

  export type LorryReceiptCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lrNo: string
    lrDate: string
    city: string
    transporter: string
    warehouse: string
    vehicleType: string
    vehicleNo: string
  }

  export type LorryReceiptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lrNo?: StringFieldUpdateOperationsInput | string
    lrDate?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    transporter?: StringFieldUpdateOperationsInput | string
    warehouse?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    vehicleNo?: StringFieldUpdateOperationsInput | string
  }

  export type LorryReceiptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lrNo?: StringFieldUpdateOperationsInput | string
    lrDate?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    transporter?: StringFieldUpdateOperationsInput | string
    warehouse?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    vehicleNo?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type VendorNullableScalarRelationFilter = {
    is?: VendorWhereInput | null
    isNot?: VendorWhereInput | null
  }

  export type PurchaseOrderListRelationFilter = {
    every?: PurchaseOrderWhereInput
    some?: PurchaseOrderWhereInput
    none?: PurchaseOrderWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PurchaseOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    phone?: SortOrder
    companyId?: SortOrder
    vendorId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    phone?: SortOrder
    companyId?: SortOrder
    vendorId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    phone?: SortOrder
    companyId?: SortOrder
    vendorId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type AddressListRelationFilter = {
    every?: AddressWhereInput
    some?: AddressWhereInput
    none?: AddressWhereInput
  }

  export type LRRequestListRelationFilter = {
    every?: LRRequestWhereInput
    some?: LRRequestWhereInput
    none?: LRRequestWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AddressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LRRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    gstNumber?: SortOrder
    panNumber?: SortOrder
    profileCompleted?: SortOrder
    taxId?: SortOrder
    paymentTerms?: SortOrder
    isActive?: SortOrder
  }

  export type VendorMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    gstNumber?: SortOrder
    panNumber?: SortOrder
    profileCompleted?: SortOrder
    taxId?: SortOrder
    paymentTerms?: SortOrder
    isActive?: SortOrder
  }

  export type VendorMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    gstNumber?: SortOrder
    panNumber?: SortOrder
    profileCompleted?: SortOrder
    taxId?: SortOrder
    paymentTerms?: SortOrder
    isActive?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    label?: SortOrder
    url?: SortOrder
    entryBy?: SortOrder
    description?: SortOrder
    linkedId?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    label?: SortOrder
    url?: SortOrder
    entryBy?: SortOrder
    description?: SortOrder
    linkedId?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    label?: SortOrder
    url?: SortOrder
    entryBy?: SortOrder
    description?: SortOrder
    linkedId?: SortOrder
  }

  export type VendorScalarRelationFilter = {
    is?: VendorWhereInput
    isNot?: VendorWhereInput
  }

  export type AddressCountOrderByAggregateInput = {
    id?: SortOrder
    line1?: SortOrder
    line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postal?: SortOrder
    country?: SortOrder
    vendorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AddressMaxOrderByAggregateInput = {
    id?: SortOrder
    line1?: SortOrder
    line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postal?: SortOrder
    country?: SortOrder
    vendorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AddressMinOrderByAggregateInput = {
    id?: SortOrder
    line1?: SortOrder
    line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postal?: SortOrder
    country?: SortOrder
    vendorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type InvoiceNullableScalarRelationFilter = {
    is?: InvoiceWhereInput | null
    isNot?: InvoiceWhereInput | null
  }

  export type LRRequestCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
    CustomerName?: SortOrder
    LRNumber?: SortOrder
    origin?: SortOrder
    destination?: SortOrder
    outDate?: SortOrder
    status?: SortOrder
    priceOffered?: SortOrder
    priceSettled?: SortOrder
    extraCost?: SortOrder
    fileNumber?: SortOrder
    remark?: SortOrder
    isInvoiced?: SortOrder
    podlink?: SortOrder
    tvendorId?: SortOrder
    invoiceId?: SortOrder
  }

  export type LRRequestAvgOrderByAggregateInput = {
    priceOffered?: SortOrder
    priceSettled?: SortOrder
    extraCost?: SortOrder
  }

  export type LRRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
    CustomerName?: SortOrder
    LRNumber?: SortOrder
    origin?: SortOrder
    destination?: SortOrder
    outDate?: SortOrder
    status?: SortOrder
    priceOffered?: SortOrder
    priceSettled?: SortOrder
    extraCost?: SortOrder
    fileNumber?: SortOrder
    remark?: SortOrder
    isInvoiced?: SortOrder
    podlink?: SortOrder
    tvendorId?: SortOrder
    invoiceId?: SortOrder
  }

  export type LRRequestMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
    CustomerName?: SortOrder
    LRNumber?: SortOrder
    origin?: SortOrder
    destination?: SortOrder
    outDate?: SortOrder
    status?: SortOrder
    priceOffered?: SortOrder
    priceSettled?: SortOrder
    extraCost?: SortOrder
    fileNumber?: SortOrder
    remark?: SortOrder
    isInvoiced?: SortOrder
    podlink?: SortOrder
    tvendorId?: SortOrder
    invoiceId?: SortOrder
  }

  export type LRRequestSumOrderByAggregateInput = {
    priceOffered?: SortOrder
    priceSettled?: SortOrder
    extraCost?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PurchaseOrderNullableScalarRelationFilter = {
    is?: PurchaseOrderWhereInput | null
    isNot?: PurchaseOrderWhereInput | null
  }

  export type InvoiceItemListRelationFilter = {
    every?: InvoiceItemWhereInput
    some?: InvoiceItemWhereInput
    none?: InvoiceItemWhereInput
  }

  export type InvoiceReferenceListRelationFilter = {
    every?: InvoiceReferenceWhereInput
    some?: InvoiceReferenceWhereInput
    none?: InvoiceReferenceWhereInput
  }

  export type InvoiceItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceReferenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceNumber?: SortOrder
    refernceNumber?: SortOrder
    invoiceDate?: SortOrder
    vendorId?: SortOrder
    poId?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrder
    hasDiscrepancy?: SortOrder
    discrepancyNotes?: SortOrder
    billTo?: SortOrder
    billToId?: SortOrder
    billToGstin?: SortOrder
    invoiceURI?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceNumber?: SortOrder
    refernceNumber?: SortOrder
    invoiceDate?: SortOrder
    vendorId?: SortOrder
    poId?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrder
    hasDiscrepancy?: SortOrder
    discrepancyNotes?: SortOrder
    billTo?: SortOrder
    billToId?: SortOrder
    billToGstin?: SortOrder
    invoiceURI?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceNumber?: SortOrder
    refernceNumber?: SortOrder
    invoiceDate?: SortOrder
    vendorId?: SortOrder
    poId?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrder
    hasDiscrepancy?: SortOrder
    discrepancyNotes?: SortOrder
    billTo?: SortOrder
    billToId?: SortOrder
    billToGstin?: SortOrder
    invoiceURI?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type InvoiceScalarRelationFilter = {
    is?: InvoiceWhereInput
    isNot?: InvoiceWhereInput
  }

  export type InvoiceReferenceCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    from?: SortOrder
    to?: SortOrder
    dueDate?: SortOrder
    paidDate?: SortOrder
    refernceId?: SortOrder
  }

  export type InvoiceReferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    from?: SortOrder
    to?: SortOrder
    dueDate?: SortOrder
    paidDate?: SortOrder
    refernceId?: SortOrder
  }

  export type InvoiceReferenceMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    from?: SortOrder
    to?: SortOrder
    dueDate?: SortOrder
    paidDate?: SortOrder
    refernceId?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type InvoiceItemCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type InvoiceItemMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceItemMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PurchaseOrderItemListRelationFilter = {
    every?: PurchaseOrderItemWhereInput
    some?: PurchaseOrderItemWhereInput
    none?: PurchaseOrderItemWhereInput
  }

  export type PurchaseOrderItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PurchaseOrderCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    poNumber?: SortOrder
    poDate?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrder
    attachments?: SortOrder
    deliveryDate?: SortOrder
    deliveryAddress?: SortOrder
    invoiceCopy?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
  }

  export type PurchaseOrderAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
  }

  export type PurchaseOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    poNumber?: SortOrder
    poDate?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrder
    attachments?: SortOrder
    deliveryDate?: SortOrder
    deliveryAddress?: SortOrder
    invoiceCopy?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
  }

  export type PurchaseOrderMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    poNumber?: SortOrder
    poDate?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
    notes?: SortOrder
    attachments?: SortOrder
    deliveryDate?: SortOrder
    deliveryAddress?: SortOrder
    invoiceCopy?: SortOrder
    vendorId?: SortOrder
    userId?: SortOrder
  }

  export type PurchaseOrderSumOrderByAggregateInput = {
    subtotal?: SortOrder
    taxRate?: SortOrder
    taxAmount?: SortOrder
    grandTotal?: SortOrder
  }

  export type PurchaseOrderScalarRelationFilter = {
    is?: PurchaseOrderWhereInput
    isNot?: PurchaseOrderWhereInput
  }

  export type PurchaseOrderItemCountOrderByAggregateInput = {
    id?: SortOrder
    poId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseOrderItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type PurchaseOrderItemMaxOrderByAggregateInput = {
    id?: SortOrder
    poId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseOrderItemMinOrderByAggregateInput = {
    id?: SortOrder
    poId?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseOrderItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    impersonatedBy?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    impersonatedBy?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    impersonatedBy?: SortOrder
    userId?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    userId?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    userId?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    userId?: SortOrder
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
  }

  export type LorryReceiptCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lrNo?: SortOrder
    lrDate?: SortOrder
    city?: SortOrder
    transporter?: SortOrder
    warehouse?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
  }

  export type LorryReceiptMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lrNo?: SortOrder
    lrDate?: SortOrder
    city?: SortOrder
    transporter?: SortOrder
    warehouse?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
  }

  export type LorryReceiptMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lrNo?: SortOrder
    lrDate?: SortOrder
    city?: SortOrder
    transporter?: SortOrder
    warehouse?: SortOrder
    vehicleType?: SortOrder
    vehicleNo?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type VendorCreateNestedOneWithoutUsersInput = {
    create?: XOR<VendorCreateWithoutUsersInput, VendorUncheckedCreateWithoutUsersInput>
    connectOrCreate?: VendorCreateOrConnectWithoutUsersInput
    connect?: VendorWhereUniqueInput
  }

  export type PurchaseOrderCreateNestedManyWithoutUserInput = {
    create?: XOR<PurchaseOrderCreateWithoutUserInput, PurchaseOrderUncheckedCreateWithoutUserInput> | PurchaseOrderCreateWithoutUserInput[] | PurchaseOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutUserInput | PurchaseOrderCreateOrConnectWithoutUserInput[]
    createMany?: PurchaseOrderCreateManyUserInputEnvelope
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type PurchaseOrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PurchaseOrderCreateWithoutUserInput, PurchaseOrderUncheckedCreateWithoutUserInput> | PurchaseOrderCreateWithoutUserInput[] | PurchaseOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutUserInput | PurchaseOrderCreateOrConnectWithoutUserInput[]
    createMany?: PurchaseOrderCreateManyUserInputEnvelope
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type VendorUpdateOneWithoutUsersNestedInput = {
    create?: XOR<VendorCreateWithoutUsersInput, VendorUncheckedCreateWithoutUsersInput>
    connectOrCreate?: VendorCreateOrConnectWithoutUsersInput
    upsert?: VendorUpsertWithoutUsersInput
    disconnect?: VendorWhereInput | boolean
    delete?: VendorWhereInput | boolean
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutUsersInput, VendorUpdateWithoutUsersInput>, VendorUncheckedUpdateWithoutUsersInput>
  }

  export type PurchaseOrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutUserInput, PurchaseOrderUncheckedCreateWithoutUserInput> | PurchaseOrderCreateWithoutUserInput[] | PurchaseOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutUserInput | PurchaseOrderCreateOrConnectWithoutUserInput[]
    upsert?: PurchaseOrderUpsertWithWhereUniqueWithoutUserInput | PurchaseOrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PurchaseOrderCreateManyUserInputEnvelope
    set?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    disconnect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    delete?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    update?: PurchaseOrderUpdateWithWhereUniqueWithoutUserInput | PurchaseOrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PurchaseOrderUpdateManyWithWhereWithoutUserInput | PurchaseOrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type PurchaseOrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutUserInput, PurchaseOrderUncheckedCreateWithoutUserInput> | PurchaseOrderCreateWithoutUserInput[] | PurchaseOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutUserInput | PurchaseOrderCreateOrConnectWithoutUserInput[]
    upsert?: PurchaseOrderUpsertWithWhereUniqueWithoutUserInput | PurchaseOrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PurchaseOrderCreateManyUserInputEnvelope
    set?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    disconnect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    delete?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    update?: PurchaseOrderUpdateWithWhereUniqueWithoutUserInput | PurchaseOrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PurchaseOrderUpdateManyWithWhereWithoutUserInput | PurchaseOrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutVendorInput = {
    create?: XOR<UserCreateWithoutVendorInput, UserUncheckedCreateWithoutVendorInput> | UserCreateWithoutVendorInput[] | UserUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutVendorInput | UserCreateOrConnectWithoutVendorInput[]
    createMany?: UserCreateManyVendorInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type InvoiceCreateNestedManyWithoutVendorInput = {
    create?: XOR<InvoiceCreateWithoutVendorInput, InvoiceUncheckedCreateWithoutVendorInput> | InvoiceCreateWithoutVendorInput[] | InvoiceUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutVendorInput | InvoiceCreateOrConnectWithoutVendorInput[]
    createMany?: InvoiceCreateManyVendorInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type PurchaseOrderCreateNestedManyWithoutVendorInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
  }

  export type AddressCreateNestedManyWithoutVendorInput = {
    create?: XOR<AddressCreateWithoutVendorInput, AddressUncheckedCreateWithoutVendorInput> | AddressCreateWithoutVendorInput[] | AddressUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutVendorInput | AddressCreateOrConnectWithoutVendorInput[]
    createMany?: AddressCreateManyVendorInputEnvelope
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
  }

  export type LRRequestCreateNestedManyWithoutTvendorInput = {
    create?: XOR<LRRequestCreateWithoutTvendorInput, LRRequestUncheckedCreateWithoutTvendorInput> | LRRequestCreateWithoutTvendorInput[] | LRRequestUncheckedCreateWithoutTvendorInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutTvendorInput | LRRequestCreateOrConnectWithoutTvendorInput[]
    createMany?: LRRequestCreateManyTvendorInputEnvelope
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<UserCreateWithoutVendorInput, UserUncheckedCreateWithoutVendorInput> | UserCreateWithoutVendorInput[] | UserUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutVendorInput | UserCreateOrConnectWithoutVendorInput[]
    createMany?: UserCreateManyVendorInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<InvoiceCreateWithoutVendorInput, InvoiceUncheckedCreateWithoutVendorInput> | InvoiceCreateWithoutVendorInput[] | InvoiceUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutVendorInput | InvoiceCreateOrConnectWithoutVendorInput[]
    createMany?: InvoiceCreateManyVendorInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
  }

  export type AddressUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<AddressCreateWithoutVendorInput, AddressUncheckedCreateWithoutVendorInput> | AddressCreateWithoutVendorInput[] | AddressUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutVendorInput | AddressCreateOrConnectWithoutVendorInput[]
    createMany?: AddressCreateManyVendorInputEnvelope
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
  }

  export type LRRequestUncheckedCreateNestedManyWithoutTvendorInput = {
    create?: XOR<LRRequestCreateWithoutTvendorInput, LRRequestUncheckedCreateWithoutTvendorInput> | LRRequestCreateWithoutTvendorInput[] | LRRequestUncheckedCreateWithoutTvendorInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutTvendorInput | LRRequestCreateOrConnectWithoutTvendorInput[]
    createMany?: LRRequestCreateManyTvendorInputEnvelope
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutVendorNestedInput = {
    create?: XOR<UserCreateWithoutVendorInput, UserUncheckedCreateWithoutVendorInput> | UserCreateWithoutVendorInput[] | UserUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutVendorInput | UserCreateOrConnectWithoutVendorInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutVendorInput | UserUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: UserCreateManyVendorInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutVendorInput | UserUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: UserUpdateManyWithWhereWithoutVendorInput | UserUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type InvoiceUpdateManyWithoutVendorNestedInput = {
    create?: XOR<InvoiceCreateWithoutVendorInput, InvoiceUncheckedCreateWithoutVendorInput> | InvoiceCreateWithoutVendorInput[] | InvoiceUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutVendorInput | InvoiceCreateOrConnectWithoutVendorInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutVendorInput | InvoiceUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: InvoiceCreateManyVendorInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutVendorInput | InvoiceUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutVendorInput | InvoiceUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type PurchaseOrderUpdateManyWithoutVendorNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    upsert?: PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput | PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    set?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    disconnect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    delete?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    update?: PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput | PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: PurchaseOrderUpdateManyWithWhereWithoutVendorInput | PurchaseOrderUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
  }

  export type AddressUpdateManyWithoutVendorNestedInput = {
    create?: XOR<AddressCreateWithoutVendorInput, AddressUncheckedCreateWithoutVendorInput> | AddressCreateWithoutVendorInput[] | AddressUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutVendorInput | AddressCreateOrConnectWithoutVendorInput[]
    upsert?: AddressUpsertWithWhereUniqueWithoutVendorInput | AddressUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: AddressCreateManyVendorInputEnvelope
    set?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    disconnect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    delete?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    update?: AddressUpdateWithWhereUniqueWithoutVendorInput | AddressUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: AddressUpdateManyWithWhereWithoutVendorInput | AddressUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: AddressScalarWhereInput | AddressScalarWhereInput[]
  }

  export type LRRequestUpdateManyWithoutTvendorNestedInput = {
    create?: XOR<LRRequestCreateWithoutTvendorInput, LRRequestUncheckedCreateWithoutTvendorInput> | LRRequestCreateWithoutTvendorInput[] | LRRequestUncheckedCreateWithoutTvendorInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutTvendorInput | LRRequestCreateOrConnectWithoutTvendorInput[]
    upsert?: LRRequestUpsertWithWhereUniqueWithoutTvendorInput | LRRequestUpsertWithWhereUniqueWithoutTvendorInput[]
    createMany?: LRRequestCreateManyTvendorInputEnvelope
    set?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    disconnect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    delete?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    update?: LRRequestUpdateWithWhereUniqueWithoutTvendorInput | LRRequestUpdateWithWhereUniqueWithoutTvendorInput[]
    updateMany?: LRRequestUpdateManyWithWhereWithoutTvendorInput | LRRequestUpdateManyWithWhereWithoutTvendorInput[]
    deleteMany?: LRRequestScalarWhereInput | LRRequestScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<UserCreateWithoutVendorInput, UserUncheckedCreateWithoutVendorInput> | UserCreateWithoutVendorInput[] | UserUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutVendorInput | UserCreateOrConnectWithoutVendorInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutVendorInput | UserUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: UserCreateManyVendorInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutVendorInput | UserUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: UserUpdateManyWithWhereWithoutVendorInput | UserUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<InvoiceCreateWithoutVendorInput, InvoiceUncheckedCreateWithoutVendorInput> | InvoiceCreateWithoutVendorInput[] | InvoiceUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutVendorInput | InvoiceCreateOrConnectWithoutVendorInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutVendorInput | InvoiceUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: InvoiceCreateManyVendorInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutVendorInput | InvoiceUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutVendorInput | InvoiceUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    upsert?: PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput | PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    set?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    disconnect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    delete?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    update?: PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput | PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: PurchaseOrderUpdateManyWithWhereWithoutVendorInput | PurchaseOrderUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
  }

  export type AddressUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<AddressCreateWithoutVendorInput, AddressUncheckedCreateWithoutVendorInput> | AddressCreateWithoutVendorInput[] | AddressUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: AddressCreateOrConnectWithoutVendorInput | AddressCreateOrConnectWithoutVendorInput[]
    upsert?: AddressUpsertWithWhereUniqueWithoutVendorInput | AddressUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: AddressCreateManyVendorInputEnvelope
    set?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    disconnect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    delete?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    connect?: AddressWhereUniqueInput | AddressWhereUniqueInput[]
    update?: AddressUpdateWithWhereUniqueWithoutVendorInput | AddressUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: AddressUpdateManyWithWhereWithoutVendorInput | AddressUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: AddressScalarWhereInput | AddressScalarWhereInput[]
  }

  export type LRRequestUncheckedUpdateManyWithoutTvendorNestedInput = {
    create?: XOR<LRRequestCreateWithoutTvendorInput, LRRequestUncheckedCreateWithoutTvendorInput> | LRRequestCreateWithoutTvendorInput[] | LRRequestUncheckedCreateWithoutTvendorInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutTvendorInput | LRRequestCreateOrConnectWithoutTvendorInput[]
    upsert?: LRRequestUpsertWithWhereUniqueWithoutTvendorInput | LRRequestUpsertWithWhereUniqueWithoutTvendorInput[]
    createMany?: LRRequestCreateManyTvendorInputEnvelope
    set?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    disconnect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    delete?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    update?: LRRequestUpdateWithWhereUniqueWithoutTvendorInput | LRRequestUpdateWithWhereUniqueWithoutTvendorInput[]
    updateMany?: LRRequestUpdateManyWithWhereWithoutTvendorInput | LRRequestUpdateManyWithWhereWithoutTvendorInput[]
    deleteMany?: LRRequestScalarWhereInput | LRRequestScalarWhereInput[]
  }

  export type VendorCreateNestedOneWithoutAddressInput = {
    create?: XOR<VendorCreateWithoutAddressInput, VendorUncheckedCreateWithoutAddressInput>
    connectOrCreate?: VendorCreateOrConnectWithoutAddressInput
    connect?: VendorWhereUniqueInput
  }

  export type VendorUpdateOneRequiredWithoutAddressNestedInput = {
    create?: XOR<VendorCreateWithoutAddressInput, VendorUncheckedCreateWithoutAddressInput>
    connectOrCreate?: VendorCreateOrConnectWithoutAddressInput
    upsert?: VendorUpsertWithoutAddressInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutAddressInput, VendorUpdateWithoutAddressInput>, VendorUncheckedUpdateWithoutAddressInput>
  }

  export type VendorCreateNestedOneWithoutLRRequestInput = {
    create?: XOR<VendorCreateWithoutLRRequestInput, VendorUncheckedCreateWithoutLRRequestInput>
    connectOrCreate?: VendorCreateOrConnectWithoutLRRequestInput
    connect?: VendorWhereUniqueInput
  }

  export type InvoiceCreateNestedOneWithoutLRRequestInput = {
    create?: XOR<InvoiceCreateWithoutLRRequestInput, InvoiceUncheckedCreateWithoutLRRequestInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLRRequestInput
    connect?: InvoiceWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VendorUpdateOneRequiredWithoutLRRequestNestedInput = {
    create?: XOR<VendorCreateWithoutLRRequestInput, VendorUncheckedCreateWithoutLRRequestInput>
    connectOrCreate?: VendorCreateOrConnectWithoutLRRequestInput
    upsert?: VendorUpsertWithoutLRRequestInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutLRRequestInput, VendorUpdateWithoutLRRequestInput>, VendorUncheckedUpdateWithoutLRRequestInput>
  }

  export type InvoiceUpdateOneWithoutLRRequestNestedInput = {
    create?: XOR<InvoiceCreateWithoutLRRequestInput, InvoiceUncheckedCreateWithoutLRRequestInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLRRequestInput
    upsert?: InvoiceUpsertWithoutLRRequestInput
    disconnect?: InvoiceWhereInput | boolean
    delete?: InvoiceWhereInput | boolean
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutLRRequestInput, InvoiceUpdateWithoutLRRequestInput>, InvoiceUncheckedUpdateWithoutLRRequestInput>
  }

  export type VendorCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<VendorCreateWithoutInvoicesInput, VendorUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: VendorCreateOrConnectWithoutInvoicesInput
    connect?: VendorWhereUniqueInput
  }

  export type PurchaseOrderCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<PurchaseOrderCreateWithoutInvoicesInput, PurchaseOrderUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutInvoicesInput
    connect?: PurchaseOrderWhereUniqueInput
  }

  export type InvoiceItemCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type LRRequestCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<LRRequestCreateWithoutInvoiceInput, LRRequestUncheckedCreateWithoutInvoiceInput> | LRRequestCreateWithoutInvoiceInput[] | LRRequestUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutInvoiceInput | LRRequestCreateOrConnectWithoutInvoiceInput[]
    createMany?: LRRequestCreateManyInvoiceInputEnvelope
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
  }

  export type InvoiceReferenceCreateNestedManyWithoutInvoiceRefernceInput = {
    create?: XOR<InvoiceReferenceCreateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput> | InvoiceReferenceCreateWithoutInvoiceRefernceInput[] | InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput[]
    connectOrCreate?: InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput | InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput[]
    createMany?: InvoiceReferenceCreateManyInvoiceRefernceInputEnvelope
    connect?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
  }

  export type InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
  }

  export type LRRequestUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<LRRequestCreateWithoutInvoiceInput, LRRequestUncheckedCreateWithoutInvoiceInput> | LRRequestCreateWithoutInvoiceInput[] | LRRequestUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutInvoiceInput | LRRequestCreateOrConnectWithoutInvoiceInput[]
    createMany?: LRRequestCreateManyInvoiceInputEnvelope
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
  }

  export type InvoiceReferenceUncheckedCreateNestedManyWithoutInvoiceRefernceInput = {
    create?: XOR<InvoiceReferenceCreateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput> | InvoiceReferenceCreateWithoutInvoiceRefernceInput[] | InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput[]
    connectOrCreate?: InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput | InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput[]
    createMany?: InvoiceReferenceCreateManyInvoiceRefernceInputEnvelope
    connect?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VendorUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<VendorCreateWithoutInvoicesInput, VendorUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: VendorCreateOrConnectWithoutInvoicesInput
    upsert?: VendorUpsertWithoutInvoicesInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutInvoicesInput, VendorUpdateWithoutInvoicesInput>, VendorUncheckedUpdateWithoutInvoicesInput>
  }

  export type PurchaseOrderUpdateOneWithoutInvoicesNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutInvoicesInput, PurchaseOrderUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutInvoicesInput
    upsert?: PurchaseOrderUpsertWithoutInvoicesInput
    disconnect?: PurchaseOrderWhereInput | boolean
    delete?: PurchaseOrderWhereInput | boolean
    connect?: PurchaseOrderWhereUniqueInput
    update?: XOR<XOR<PurchaseOrderUpdateToOneWithWhereWithoutInvoicesInput, PurchaseOrderUpdateWithoutInvoicesInput>, PurchaseOrderUncheckedUpdateWithoutInvoicesInput>
  }

  export type InvoiceItemUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type LRRequestUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<LRRequestCreateWithoutInvoiceInput, LRRequestUncheckedCreateWithoutInvoiceInput> | LRRequestCreateWithoutInvoiceInput[] | LRRequestUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutInvoiceInput | LRRequestCreateOrConnectWithoutInvoiceInput[]
    upsert?: LRRequestUpsertWithWhereUniqueWithoutInvoiceInput | LRRequestUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: LRRequestCreateManyInvoiceInputEnvelope
    set?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    disconnect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    delete?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    update?: LRRequestUpdateWithWhereUniqueWithoutInvoiceInput | LRRequestUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: LRRequestUpdateManyWithWhereWithoutInvoiceInput | LRRequestUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: LRRequestScalarWhereInput | LRRequestScalarWhereInput[]
  }

  export type InvoiceReferenceUpdateManyWithoutInvoiceRefernceNestedInput = {
    create?: XOR<InvoiceReferenceCreateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput> | InvoiceReferenceCreateWithoutInvoiceRefernceInput[] | InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput[]
    connectOrCreate?: InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput | InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput[]
    upsert?: InvoiceReferenceUpsertWithWhereUniqueWithoutInvoiceRefernceInput | InvoiceReferenceUpsertWithWhereUniqueWithoutInvoiceRefernceInput[]
    createMany?: InvoiceReferenceCreateManyInvoiceRefernceInputEnvelope
    set?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    disconnect?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    delete?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    connect?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    update?: InvoiceReferenceUpdateWithWhereUniqueWithoutInvoiceRefernceInput | InvoiceReferenceUpdateWithWhereUniqueWithoutInvoiceRefernceInput[]
    updateMany?: InvoiceReferenceUpdateManyWithWhereWithoutInvoiceRefernceInput | InvoiceReferenceUpdateManyWithWhereWithoutInvoiceRefernceInput[]
    deleteMany?: InvoiceReferenceScalarWhereInput | InvoiceReferenceScalarWhereInput[]
  }

  export type InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput> | InvoiceItemCreateWithoutInvoiceInput[] | InvoiceItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceItemCreateOrConnectWithoutInvoiceInput | InvoiceItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceItemCreateManyInvoiceInputEnvelope
    set?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    disconnect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    delete?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    connect?: InvoiceItemWhereUniqueInput | InvoiceItemWhereUniqueInput[]
    update?: InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
  }

  export type LRRequestUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<LRRequestCreateWithoutInvoiceInput, LRRequestUncheckedCreateWithoutInvoiceInput> | LRRequestCreateWithoutInvoiceInput[] | LRRequestUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: LRRequestCreateOrConnectWithoutInvoiceInput | LRRequestCreateOrConnectWithoutInvoiceInput[]
    upsert?: LRRequestUpsertWithWhereUniqueWithoutInvoiceInput | LRRequestUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: LRRequestCreateManyInvoiceInputEnvelope
    set?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    disconnect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    delete?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    connect?: LRRequestWhereUniqueInput | LRRequestWhereUniqueInput[]
    update?: LRRequestUpdateWithWhereUniqueWithoutInvoiceInput | LRRequestUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: LRRequestUpdateManyWithWhereWithoutInvoiceInput | LRRequestUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: LRRequestScalarWhereInput | LRRequestScalarWhereInput[]
  }

  export type InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceNestedInput = {
    create?: XOR<InvoiceReferenceCreateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput> | InvoiceReferenceCreateWithoutInvoiceRefernceInput[] | InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput[]
    connectOrCreate?: InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput | InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput[]
    upsert?: InvoiceReferenceUpsertWithWhereUniqueWithoutInvoiceRefernceInput | InvoiceReferenceUpsertWithWhereUniqueWithoutInvoiceRefernceInput[]
    createMany?: InvoiceReferenceCreateManyInvoiceRefernceInputEnvelope
    set?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    disconnect?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    delete?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    connect?: InvoiceReferenceWhereUniqueInput | InvoiceReferenceWhereUniqueInput[]
    update?: InvoiceReferenceUpdateWithWhereUniqueWithoutInvoiceRefernceInput | InvoiceReferenceUpdateWithWhereUniqueWithoutInvoiceRefernceInput[]
    updateMany?: InvoiceReferenceUpdateManyWithWhereWithoutInvoiceRefernceInput | InvoiceReferenceUpdateManyWithWhereWithoutInvoiceRefernceInput[]
    deleteMany?: InvoiceReferenceScalarWhereInput | InvoiceReferenceScalarWhereInput[]
  }

  export type InvoiceCreateNestedOneWithoutInvoiceReferenceInput = {
    create?: XOR<InvoiceCreateWithoutInvoiceReferenceInput, InvoiceUncheckedCreateWithoutInvoiceReferenceInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutInvoiceReferenceInput
    connect?: InvoiceWhereUniqueInput
  }

  export type InvoiceUpdateOneRequiredWithoutInvoiceReferenceNestedInput = {
    create?: XOR<InvoiceCreateWithoutInvoiceReferenceInput, InvoiceUncheckedCreateWithoutInvoiceReferenceInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutInvoiceReferenceInput
    upsert?: InvoiceUpsertWithoutInvoiceReferenceInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutInvoiceReferenceInput, InvoiceUpdateWithoutInvoiceReferenceInput>, InvoiceUncheckedUpdateWithoutInvoiceReferenceInput>
  }

  export type InvoiceCreateNestedOneWithoutItemsInput = {
    create?: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutItemsInput
    connect?: InvoiceWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InvoiceUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutItemsInput
    upsert?: InvoiceUpsertWithoutItemsInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutItemsInput, InvoiceUpdateWithoutItemsInput>, InvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type VendorCreateNestedOneWithoutPurchaseOrderInput = {
    create?: XOR<VendorCreateWithoutPurchaseOrderInput, VendorUncheckedCreateWithoutPurchaseOrderInput>
    connectOrCreate?: VendorCreateOrConnectWithoutPurchaseOrderInput
    connect?: VendorWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPurchaseOrderInput = {
    create?: XOR<UserCreateWithoutPurchaseOrderInput, UserUncheckedCreateWithoutPurchaseOrderInput>
    connectOrCreate?: UserCreateOrConnectWithoutPurchaseOrderInput
    connect?: UserWhereUniqueInput
  }

  export type PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
  }

  export type InvoiceCreateNestedManyWithoutPurchaseOrderInput = {
    create?: XOR<InvoiceCreateWithoutPurchaseOrderInput, InvoiceUncheckedCreateWithoutPurchaseOrderInput> | InvoiceCreateWithoutPurchaseOrderInput[] | InvoiceUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutPurchaseOrderInput | InvoiceCreateOrConnectWithoutPurchaseOrderInput[]
    createMany?: InvoiceCreateManyPurchaseOrderInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutPurchaseOrderInput = {
    create?: XOR<InvoiceCreateWithoutPurchaseOrderInput, InvoiceUncheckedCreateWithoutPurchaseOrderInput> | InvoiceCreateWithoutPurchaseOrderInput[] | InvoiceUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutPurchaseOrderInput | InvoiceCreateOrConnectWithoutPurchaseOrderInput[]
    createMany?: InvoiceCreateManyPurchaseOrderInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type VendorUpdateOneRequiredWithoutPurchaseOrderNestedInput = {
    create?: XOR<VendorCreateWithoutPurchaseOrderInput, VendorUncheckedCreateWithoutPurchaseOrderInput>
    connectOrCreate?: VendorCreateOrConnectWithoutPurchaseOrderInput
    upsert?: VendorUpsertWithoutPurchaseOrderInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutPurchaseOrderInput, VendorUpdateWithoutPurchaseOrderInput>, VendorUncheckedUpdateWithoutPurchaseOrderInput>
  }

  export type UserUpdateOneRequiredWithoutPurchaseOrderNestedInput = {
    create?: XOR<UserCreateWithoutPurchaseOrderInput, UserUncheckedCreateWithoutPurchaseOrderInput>
    connectOrCreate?: UserCreateOrConnectWithoutPurchaseOrderInput
    upsert?: UserUpsertWithoutPurchaseOrderInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPurchaseOrderInput, UserUpdateWithoutPurchaseOrderInput>, UserUncheckedUpdateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    upsert?: PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    set?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    disconnect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    delete?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    update?: PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput[]
    updateMany?: PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput | PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput[]
    deleteMany?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
  }

  export type InvoiceUpdateManyWithoutPurchaseOrderNestedInput = {
    create?: XOR<InvoiceCreateWithoutPurchaseOrderInput, InvoiceUncheckedCreateWithoutPurchaseOrderInput> | InvoiceCreateWithoutPurchaseOrderInput[] | InvoiceUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutPurchaseOrderInput | InvoiceCreateOrConnectWithoutPurchaseOrderInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutPurchaseOrderInput | InvoiceUpsertWithWhereUniqueWithoutPurchaseOrderInput[]
    createMany?: InvoiceCreateManyPurchaseOrderInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutPurchaseOrderInput | InvoiceUpdateWithWhereUniqueWithoutPurchaseOrderInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutPurchaseOrderInput | InvoiceUpdateManyWithWhereWithoutPurchaseOrderInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    upsert?: PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    set?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    disconnect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    delete?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    update?: PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput[]
    updateMany?: PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput | PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput[]
    deleteMany?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutPurchaseOrderNestedInput = {
    create?: XOR<InvoiceCreateWithoutPurchaseOrderInput, InvoiceUncheckedCreateWithoutPurchaseOrderInput> | InvoiceCreateWithoutPurchaseOrderInput[] | InvoiceUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutPurchaseOrderInput | InvoiceCreateOrConnectWithoutPurchaseOrderInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutPurchaseOrderInput | InvoiceUpsertWithWhereUniqueWithoutPurchaseOrderInput[]
    createMany?: InvoiceCreateManyPurchaseOrderInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutPurchaseOrderInput | InvoiceUpdateWithWhereUniqueWithoutPurchaseOrderInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutPurchaseOrderInput | InvoiceUpdateManyWithWhereWithoutPurchaseOrderInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type PurchaseOrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutItemsInput
    connect?: PurchaseOrderWhereUniqueInput
  }

  export type PurchaseOrderUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutItemsInput
    upsert?: PurchaseOrderUpsertWithoutItemsInput
    connect?: PurchaseOrderWhereUniqueInput
    update?: XOR<XOR<PurchaseOrderUpdateToOneWithWhereWithoutItemsInput, PurchaseOrderUpdateWithoutItemsInput>, PurchaseOrderUncheckedUpdateWithoutItemsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    scope?: string | null
    password?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    scope?: string | null
    password?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
  }

  export type VendorCreateWithoutUsersInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    invoices?: InvoiceCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutVendorInput
    Address?: AddressCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestCreateNestedManyWithoutTvendorInput
  }

  export type VendorUncheckedCreateWithoutUsersInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    invoices?: InvoiceUncheckedCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput
    Address?: AddressUncheckedCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutTvendorInput
  }

  export type VendorCreateOrConnectWithoutUsersInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutUsersInput, VendorUncheckedCreateWithoutUsersInput>
  }

  export type PurchaseOrderCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendor: VendorCreateNestedOneWithoutPurchaseOrderInput
    items?: PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput
    invoices?: InvoiceCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUncheckedCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendorId: string
    items?: PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderCreateOrConnectWithoutUserInput = {
    where: PurchaseOrderWhereUniqueInput
    create: XOR<PurchaseOrderCreateWithoutUserInput, PurchaseOrderUncheckedCreateWithoutUserInput>
  }

  export type PurchaseOrderCreateManyUserInputEnvelope = {
    data: PurchaseOrderCreateManyUserInput | PurchaseOrderCreateManyUserInput[]
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    userId?: StringFilter<"Account"> | string
  }

  export type VendorUpsertWithoutUsersInput = {
    update: XOR<VendorUpdateWithoutUsersInput, VendorUncheckedUpdateWithoutUsersInput>
    create: XOR<VendorCreateWithoutUsersInput, VendorUncheckedCreateWithoutUsersInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutUsersInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutUsersInput, VendorUncheckedUpdateWithoutUsersInput>
  }

  export type VendorUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    invoices?: InvoiceUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutVendorNestedInput
    Address?: AddressUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUpdateManyWithoutTvendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    invoices?: InvoiceUncheckedUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput
    Address?: AddressUncheckedUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutTvendorNestedInput
  }

  export type PurchaseOrderUpsertWithWhereUniqueWithoutUserInput = {
    where: PurchaseOrderWhereUniqueInput
    update: XOR<PurchaseOrderUpdateWithoutUserInput, PurchaseOrderUncheckedUpdateWithoutUserInput>
    create: XOR<PurchaseOrderCreateWithoutUserInput, PurchaseOrderUncheckedCreateWithoutUserInput>
  }

  export type PurchaseOrderUpdateWithWhereUniqueWithoutUserInput = {
    where: PurchaseOrderWhereUniqueInput
    data: XOR<PurchaseOrderUpdateWithoutUserInput, PurchaseOrderUncheckedUpdateWithoutUserInput>
  }

  export type PurchaseOrderUpdateManyWithWhereWithoutUserInput = {
    where: PurchaseOrderScalarWhereInput
    data: XOR<PurchaseOrderUpdateManyMutationInput, PurchaseOrderUncheckedUpdateManyWithoutUserInput>
  }

  export type PurchaseOrderScalarWhereInput = {
    AND?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
    OR?: PurchaseOrderScalarWhereInput[]
    NOT?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
    id?: StringFilter<"PurchaseOrder"> | string
    createdAt?: DateTimeFilter<"PurchaseOrder"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrder"> | Date | string
    poNumber?: StringFilter<"PurchaseOrder"> | string
    poDate?: DateTimeFilter<"PurchaseOrder"> | Date | string
    status?: StringFilter<"PurchaseOrder"> | string
    subtotal?: FloatFilter<"PurchaseOrder"> | number
    taxRate?: FloatFilter<"PurchaseOrder"> | number
    taxAmount?: FloatFilter<"PurchaseOrder"> | number
    grandTotal?: FloatFilter<"PurchaseOrder"> | number
    notes?: StringNullableFilter<"PurchaseOrder"> | string | null
    attachments?: StringNullableFilter<"PurchaseOrder"> | string | null
    deliveryDate?: DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null
    deliveryAddress?: StringNullableFilter<"PurchaseOrder"> | string | null
    invoiceCopy?: StringNullableFilter<"PurchaseOrder"> | string | null
    vendorId?: StringFilter<"PurchaseOrder"> | string
    userId?: StringFilter<"PurchaseOrder"> | string
  }

  export type UserCreateWithoutVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVendorInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVendorInput, UserUncheckedCreateWithoutVendorInput>
  }

  export type UserCreateManyVendorInputEnvelope = {
    data: UserCreateManyVendorInput | UserCreateManyVendorInput[]
  }

  export type InvoiceCreateWithoutVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    purchaseOrder?: PurchaseOrderCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceUncheckedCreateWithoutVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    poId?: string | null
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceUncheckedCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceCreateOrConnectWithoutVendorInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutVendorInput, InvoiceUncheckedCreateWithoutVendorInput>
  }

  export type InvoiceCreateManyVendorInputEnvelope = {
    data: InvoiceCreateManyVendorInput | InvoiceCreateManyVendorInput[]
  }

  export type PurchaseOrderCreateWithoutVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    user: UserCreateNestedOneWithoutPurchaseOrderInput
    items?: PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput
    invoices?: InvoiceCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUncheckedCreateWithoutVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    userId: string
    items?: PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderCreateOrConnectWithoutVendorInput = {
    where: PurchaseOrderWhereUniqueInput
    create: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput>
  }

  export type PurchaseOrderCreateManyVendorInputEnvelope = {
    data: PurchaseOrderCreateManyVendorInput | PurchaseOrderCreateManyVendorInput[]
  }

  export type AddressCreateWithoutVendorInput = {
    id?: string
    line1: string
    line2?: string | null
    city: string
    state?: string | null
    postal?: string | null
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressUncheckedCreateWithoutVendorInput = {
    id?: string
    line1: string
    line2?: string | null
    city: string
    state?: string | null
    postal?: string | null
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AddressCreateOrConnectWithoutVendorInput = {
    where: AddressWhereUniqueInput
    create: XOR<AddressCreateWithoutVendorInput, AddressUncheckedCreateWithoutVendorInput>
  }

  export type AddressCreateManyVendorInputEnvelope = {
    data: AddressCreateManyVendorInput | AddressCreateManyVendorInput[]
  }

  export type LRRequestCreateWithoutTvendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    Invoice?: InvoiceCreateNestedOneWithoutLRRequestInput
  }

  export type LRRequestUncheckedCreateWithoutTvendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    invoiceId?: string | null
  }

  export type LRRequestCreateOrConnectWithoutTvendorInput = {
    where: LRRequestWhereUniqueInput
    create: XOR<LRRequestCreateWithoutTvendorInput, LRRequestUncheckedCreateWithoutTvendorInput>
  }

  export type LRRequestCreateManyTvendorInputEnvelope = {
    data: LRRequestCreateManyTvendorInput | LRRequestCreateManyTvendorInput[]
  }

  export type UserUpsertWithWhereUniqueWithoutVendorInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutVendorInput, UserUncheckedUpdateWithoutVendorInput>
    create: XOR<UserCreateWithoutVendorInput, UserUncheckedCreateWithoutVendorInput>
  }

  export type UserUpdateWithWhereUniqueWithoutVendorInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutVendorInput, UserUncheckedUpdateWithoutVendorInput>
  }

  export type UserUpdateManyWithWhereWithoutVendorInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutVendorInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    phone?: StringNullableFilter<"User"> | string | null
    companyId?: StringNullableFilter<"User"> | string | null
    vendorId?: StringNullableFilter<"User"> | string | null
  }

  export type InvoiceUpsertWithWhereUniqueWithoutVendorInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutVendorInput, InvoiceUncheckedUpdateWithoutVendorInput>
    create: XOR<InvoiceCreateWithoutVendorInput, InvoiceUncheckedCreateWithoutVendorInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutVendorInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutVendorInput, InvoiceUncheckedUpdateWithoutVendorInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutVendorInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutVendorInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    invoiceNumber?: StringNullableFilter<"Invoice"> | string | null
    refernceNumber?: StringFilter<"Invoice"> | string
    invoiceDate?: DateTimeFilter<"Invoice"> | Date | string
    vendorId?: StringFilter<"Invoice"> | string
    poId?: StringNullableFilter<"Invoice"> | string | null
    status?: StringFilter<"Invoice"> | string
    subtotal?: FloatFilter<"Invoice"> | number
    taxRate?: FloatFilter<"Invoice"> | number
    taxAmount?: FloatFilter<"Invoice"> | number
    grandTotal?: FloatFilter<"Invoice"> | number
    notes?: StringNullableFilter<"Invoice"> | string | null
    hasDiscrepancy?: BoolFilter<"Invoice"> | boolean
    discrepancyNotes?: StringNullableFilter<"Invoice"> | string | null
    billTo?: StringNullableFilter<"Invoice"> | string | null
    billToId?: StringNullableFilter<"Invoice"> | string | null
    billToGstin?: StringNullableFilter<"Invoice"> | string | null
    invoiceURI?: StringNullableFilter<"Invoice"> | string | null
  }

  export type PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput = {
    where: PurchaseOrderWhereUniqueInput
    update: XOR<PurchaseOrderUpdateWithoutVendorInput, PurchaseOrderUncheckedUpdateWithoutVendorInput>
    create: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput>
  }

  export type PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput = {
    where: PurchaseOrderWhereUniqueInput
    data: XOR<PurchaseOrderUpdateWithoutVendorInput, PurchaseOrderUncheckedUpdateWithoutVendorInput>
  }

  export type PurchaseOrderUpdateManyWithWhereWithoutVendorInput = {
    where: PurchaseOrderScalarWhereInput
    data: XOR<PurchaseOrderUpdateManyMutationInput, PurchaseOrderUncheckedUpdateManyWithoutVendorInput>
  }

  export type AddressUpsertWithWhereUniqueWithoutVendorInput = {
    where: AddressWhereUniqueInput
    update: XOR<AddressUpdateWithoutVendorInput, AddressUncheckedUpdateWithoutVendorInput>
    create: XOR<AddressCreateWithoutVendorInput, AddressUncheckedCreateWithoutVendorInput>
  }

  export type AddressUpdateWithWhereUniqueWithoutVendorInput = {
    where: AddressWhereUniqueInput
    data: XOR<AddressUpdateWithoutVendorInput, AddressUncheckedUpdateWithoutVendorInput>
  }

  export type AddressUpdateManyWithWhereWithoutVendorInput = {
    where: AddressScalarWhereInput
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyWithoutVendorInput>
  }

  export type AddressScalarWhereInput = {
    AND?: AddressScalarWhereInput | AddressScalarWhereInput[]
    OR?: AddressScalarWhereInput[]
    NOT?: AddressScalarWhereInput | AddressScalarWhereInput[]
    id?: StringFilter<"Address"> | string
    line1?: StringFilter<"Address"> | string
    line2?: StringNullableFilter<"Address"> | string | null
    city?: StringFilter<"Address"> | string
    state?: StringNullableFilter<"Address"> | string | null
    postal?: StringNullableFilter<"Address"> | string | null
    country?: StringFilter<"Address"> | string
    vendorId?: StringFilter<"Address"> | string
    createdAt?: DateTimeFilter<"Address"> | Date | string
    updatedAt?: DateTimeFilter<"Address"> | Date | string
  }

  export type LRRequestUpsertWithWhereUniqueWithoutTvendorInput = {
    where: LRRequestWhereUniqueInput
    update: XOR<LRRequestUpdateWithoutTvendorInput, LRRequestUncheckedUpdateWithoutTvendorInput>
    create: XOR<LRRequestCreateWithoutTvendorInput, LRRequestUncheckedCreateWithoutTvendorInput>
  }

  export type LRRequestUpdateWithWhereUniqueWithoutTvendorInput = {
    where: LRRequestWhereUniqueInput
    data: XOR<LRRequestUpdateWithoutTvendorInput, LRRequestUncheckedUpdateWithoutTvendorInput>
  }

  export type LRRequestUpdateManyWithWhereWithoutTvendorInput = {
    where: LRRequestScalarWhereInput
    data: XOR<LRRequestUpdateManyMutationInput, LRRequestUncheckedUpdateManyWithoutTvendorInput>
  }

  export type LRRequestScalarWhereInput = {
    AND?: LRRequestScalarWhereInput | LRRequestScalarWhereInput[]
    OR?: LRRequestScalarWhereInput[]
    NOT?: LRRequestScalarWhereInput | LRRequestScalarWhereInput[]
    id?: StringFilter<"LRRequest"> | string
    createdAt?: DateTimeFilter<"LRRequest"> | Date | string
    updatedAt?: DateTimeFilter<"LRRequest"> | Date | string
    vehicleType?: StringNullableFilter<"LRRequest"> | string | null
    vehicleNo?: StringNullableFilter<"LRRequest"> | string | null
    CustomerName?: StringNullableFilter<"LRRequest"> | string | null
    LRNumber?: StringFilter<"LRRequest"> | string
    origin?: StringNullableFilter<"LRRequest"> | string | null
    destination?: StringNullableFilter<"LRRequest"> | string | null
    outDate?: DateTimeFilter<"LRRequest"> | Date | string
    status?: StringNullableFilter<"LRRequest"> | string | null
    priceOffered?: FloatNullableFilter<"LRRequest"> | number | null
    priceSettled?: FloatNullableFilter<"LRRequest"> | number | null
    extraCost?: FloatNullableFilter<"LRRequest"> | number | null
    fileNumber?: StringFilter<"LRRequest"> | string
    remark?: StringNullableFilter<"LRRequest"> | string | null
    isInvoiced?: BoolFilter<"LRRequest"> | boolean
    podlink?: StringNullableFilter<"LRRequest"> | string | null
    tvendorId?: StringFilter<"LRRequest"> | string
    invoiceId?: StringNullableFilter<"LRRequest"> | string | null
  }

  export type VendorCreateWithoutAddressInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserCreateNestedManyWithoutVendorInput
    invoices?: InvoiceCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestCreateNestedManyWithoutTvendorInput
  }

  export type VendorUncheckedCreateWithoutAddressInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutVendorInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutTvendorInput
  }

  export type VendorCreateOrConnectWithoutAddressInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutAddressInput, VendorUncheckedCreateWithoutAddressInput>
  }

  export type VendorUpsertWithoutAddressInput = {
    update: XOR<VendorUpdateWithoutAddressInput, VendorUncheckedUpdateWithoutAddressInput>
    create: XOR<VendorCreateWithoutAddressInput, VendorUncheckedCreateWithoutAddressInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutAddressInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutAddressInput, VendorUncheckedUpdateWithoutAddressInput>
  }

  export type VendorUpdateWithoutAddressInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUpdateManyWithoutTvendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutAddressInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutTvendorNestedInput
  }

  export type VendorCreateWithoutLRRequestInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserCreateNestedManyWithoutVendorInput
    invoices?: InvoiceCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutVendorInput
    Address?: AddressCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateWithoutLRRequestInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutVendorInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput
    Address?: AddressUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorCreateOrConnectWithoutLRRequestInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutLRRequestInput, VendorUncheckedCreateWithoutLRRequestInput>
  }

  export type InvoiceCreateWithoutLRRequestInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    vendor: VendorCreateNestedOneWithoutInvoicesInput
    purchaseOrder?: PurchaseOrderCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceUncheckedCreateWithoutLRRequestInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    vendorId: string
    poId?: string | null
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceUncheckedCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceCreateOrConnectWithoutLRRequestInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutLRRequestInput, InvoiceUncheckedCreateWithoutLRRequestInput>
  }

  export type VendorUpsertWithoutLRRequestInput = {
    update: XOR<VendorUpdateWithoutLRRequestInput, VendorUncheckedUpdateWithoutLRRequestInput>
    create: XOR<VendorCreateWithoutLRRequestInput, VendorUncheckedCreateWithoutLRRequestInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutLRRequestInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutLRRequestInput, VendorUncheckedUpdateWithoutLRRequestInput>
  }

  export type VendorUpdateWithoutLRRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutVendorNestedInput
    Address?: AddressUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutLRRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput
    Address?: AddressUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type InvoiceUpsertWithoutLRRequestInput = {
    update: XOR<InvoiceUpdateWithoutLRRequestInput, InvoiceUncheckedUpdateWithoutLRRequestInput>
    create: XOR<InvoiceCreateWithoutLRRequestInput, InvoiceUncheckedCreateWithoutLRRequestInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutLRRequestInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutLRRequestInput, InvoiceUncheckedUpdateWithoutLRRequestInput>
  }

  export type InvoiceUpdateWithoutLRRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutInvoicesNestedInput
    purchaseOrder?: PurchaseOrderUpdateOneWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutLRRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: StringFieldUpdateOperationsInput | string
    poId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type VendorCreateWithoutInvoicesInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutVendorInput
    Address?: AddressCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestCreateNestedManyWithoutTvendorInput
  }

  export type VendorUncheckedCreateWithoutInvoicesInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutVendorInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput
    Address?: AddressUncheckedCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutTvendorInput
  }

  export type VendorCreateOrConnectWithoutInvoicesInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutInvoicesInput, VendorUncheckedCreateWithoutInvoicesInput>
  }

  export type PurchaseOrderCreateWithoutInvoicesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendor: VendorCreateNestedOneWithoutPurchaseOrderInput
    user: UserCreateNestedOneWithoutPurchaseOrderInput
    items?: PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUncheckedCreateWithoutInvoicesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendorId: string
    userId: string
    items?: PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderCreateOrConnectWithoutInvoicesInput = {
    where: PurchaseOrderWhereUniqueInput
    create: XOR<PurchaseOrderCreateWithoutInvoicesInput, PurchaseOrderUncheckedCreateWithoutInvoicesInput>
  }

  export type InvoiceItemCreateWithoutInvoiceInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceItemUncheckedCreateWithoutInvoiceInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceItemCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    create: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceItemCreateManyInvoiceInputEnvelope = {
    data: InvoiceItemCreateManyInvoiceInput | InvoiceItemCreateManyInvoiceInput[]
  }

  export type LRRequestCreateWithoutInvoiceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    tvendor: VendorCreateNestedOneWithoutLRRequestInput
  }

  export type LRRequestUncheckedCreateWithoutInvoiceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    tvendorId: string
  }

  export type LRRequestCreateOrConnectWithoutInvoiceInput = {
    where: LRRequestWhereUniqueInput
    create: XOR<LRRequestCreateWithoutInvoiceInput, LRRequestUncheckedCreateWithoutInvoiceInput>
  }

  export type LRRequestCreateManyInvoiceInputEnvelope = {
    data: LRRequestCreateManyInvoiceInput | LRRequestCreateManyInvoiceInput[]
  }

  export type InvoiceReferenceCreateWithoutInvoiceRefernceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    from: Date | string
    to: Date | string
    dueDate?: Date | string | null
    paidDate?: Date | string | null
  }

  export type InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    from: Date | string
    to: Date | string
    dueDate?: Date | string | null
    paidDate?: Date | string | null
  }

  export type InvoiceReferenceCreateOrConnectWithoutInvoiceRefernceInput = {
    where: InvoiceReferenceWhereUniqueInput
    create: XOR<InvoiceReferenceCreateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput>
  }

  export type InvoiceReferenceCreateManyInvoiceRefernceInputEnvelope = {
    data: InvoiceReferenceCreateManyInvoiceRefernceInput | InvoiceReferenceCreateManyInvoiceRefernceInput[]
  }

  export type VendorUpsertWithoutInvoicesInput = {
    update: XOR<VendorUpdateWithoutInvoicesInput, VendorUncheckedUpdateWithoutInvoicesInput>
    create: XOR<VendorCreateWithoutInvoicesInput, VendorUncheckedCreateWithoutInvoicesInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutInvoicesInput, VendorUncheckedUpdateWithoutInvoicesInput>
  }

  export type VendorUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutVendorNestedInput
    Address?: AddressUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUpdateManyWithoutTvendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutVendorNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput
    Address?: AddressUncheckedUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutTvendorNestedInput
  }

  export type PurchaseOrderUpsertWithoutInvoicesInput = {
    update: XOR<PurchaseOrderUpdateWithoutInvoicesInput, PurchaseOrderUncheckedUpdateWithoutInvoicesInput>
    create: XOR<PurchaseOrderCreateWithoutInvoicesInput, PurchaseOrderUncheckedCreateWithoutInvoicesInput>
    where?: PurchaseOrderWhereInput
  }

  export type PurchaseOrderUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: PurchaseOrderWhereInput
    data: XOR<PurchaseOrderUpdateWithoutInvoicesInput, PurchaseOrderUncheckedUpdateWithoutInvoicesInput>
  }

  export type PurchaseOrderUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutPurchaseOrderNestedInput
    user?: UserUpdateOneRequiredWithoutPurchaseOrderNestedInput
    items?: PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    items?: PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    update: XOR<InvoiceItemUpdateWithoutInvoiceInput, InvoiceItemUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceItemCreateWithoutInvoiceInput, InvoiceItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceItemWhereUniqueInput
    data: XOR<InvoiceItemUpdateWithoutInvoiceInput, InvoiceItemUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceItemUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceItemScalarWhereInput
    data: XOR<InvoiceItemUpdateManyMutationInput, InvoiceItemUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type InvoiceItemScalarWhereInput = {
    AND?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
    OR?: InvoiceItemScalarWhereInput[]
    NOT?: InvoiceItemScalarWhereInput | InvoiceItemScalarWhereInput[]
    id?: StringFilter<"InvoiceItem"> | string
    invoiceId?: StringFilter<"InvoiceItem"> | string
    description?: StringFilter<"InvoiceItem"> | string
    quantity?: IntFilter<"InvoiceItem"> | number
    unitPrice?: FloatFilter<"InvoiceItem"> | number
    total?: FloatFilter<"InvoiceItem"> | number
    notes?: StringNullableFilter<"InvoiceItem"> | string | null
    createdAt?: DateTimeFilter<"InvoiceItem"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceItem"> | Date | string
  }

  export type LRRequestUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: LRRequestWhereUniqueInput
    update: XOR<LRRequestUpdateWithoutInvoiceInput, LRRequestUncheckedUpdateWithoutInvoiceInput>
    create: XOR<LRRequestCreateWithoutInvoiceInput, LRRequestUncheckedCreateWithoutInvoiceInput>
  }

  export type LRRequestUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: LRRequestWhereUniqueInput
    data: XOR<LRRequestUpdateWithoutInvoiceInput, LRRequestUncheckedUpdateWithoutInvoiceInput>
  }

  export type LRRequestUpdateManyWithWhereWithoutInvoiceInput = {
    where: LRRequestScalarWhereInput
    data: XOR<LRRequestUpdateManyMutationInput, LRRequestUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type InvoiceReferenceUpsertWithWhereUniqueWithoutInvoiceRefernceInput = {
    where: InvoiceReferenceWhereUniqueInput
    update: XOR<InvoiceReferenceUpdateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedUpdateWithoutInvoiceRefernceInput>
    create: XOR<InvoiceReferenceCreateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedCreateWithoutInvoiceRefernceInput>
  }

  export type InvoiceReferenceUpdateWithWhereUniqueWithoutInvoiceRefernceInput = {
    where: InvoiceReferenceWhereUniqueInput
    data: XOR<InvoiceReferenceUpdateWithoutInvoiceRefernceInput, InvoiceReferenceUncheckedUpdateWithoutInvoiceRefernceInput>
  }

  export type InvoiceReferenceUpdateManyWithWhereWithoutInvoiceRefernceInput = {
    where: InvoiceReferenceScalarWhereInput
    data: XOR<InvoiceReferenceUpdateManyMutationInput, InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceInput>
  }

  export type InvoiceReferenceScalarWhereInput = {
    AND?: InvoiceReferenceScalarWhereInput | InvoiceReferenceScalarWhereInput[]
    OR?: InvoiceReferenceScalarWhereInput[]
    NOT?: InvoiceReferenceScalarWhereInput | InvoiceReferenceScalarWhereInput[]
    id?: StringFilter<"InvoiceReference"> | string
    createdAt?: DateTimeFilter<"InvoiceReference"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceReference"> | Date | string
    from?: DateTimeFilter<"InvoiceReference"> | Date | string
    to?: DateTimeFilter<"InvoiceReference"> | Date | string
    dueDate?: DateTimeNullableFilter<"InvoiceReference"> | Date | string | null
    paidDate?: DateTimeNullableFilter<"InvoiceReference"> | Date | string | null
    refernceId?: StringFilter<"InvoiceReference"> | string
  }

  export type InvoiceCreateWithoutInvoiceReferenceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    vendor: VendorCreateNestedOneWithoutInvoicesInput
    purchaseOrder?: PurchaseOrderCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutInvoiceReferenceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    vendorId: string
    poId?: string | null
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutInvoiceReferenceInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutInvoiceReferenceInput, InvoiceUncheckedCreateWithoutInvoiceReferenceInput>
  }

  export type InvoiceUpsertWithoutInvoiceReferenceInput = {
    update: XOR<InvoiceUpdateWithoutInvoiceReferenceInput, InvoiceUncheckedUpdateWithoutInvoiceReferenceInput>
    create: XOR<InvoiceCreateWithoutInvoiceReferenceInput, InvoiceUncheckedCreateWithoutInvoiceReferenceInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutInvoiceReferenceInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutInvoiceReferenceInput, InvoiceUncheckedUpdateWithoutInvoiceReferenceInput>
  }

  export type InvoiceUpdateWithoutInvoiceReferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutInvoicesNestedInput
    purchaseOrder?: PurchaseOrderUpdateOneWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutInvoiceReferenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: StringFieldUpdateOperationsInput | string
    poId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceCreateWithoutItemsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    vendor: VendorCreateNestedOneWithoutInvoicesInput
    purchaseOrder?: PurchaseOrderCreateNestedOneWithoutInvoicesInput
    LRRequest?: LRRequestCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceUncheckedCreateWithoutItemsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    vendorId: string
    poId?: string | null
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceUncheckedCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceCreateOrConnectWithoutItemsInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
  }

  export type InvoiceUpsertWithoutItemsInput = {
    update: XOR<InvoiceUpdateWithoutItemsInput, InvoiceUncheckedUpdateWithoutItemsInput>
    create: XOR<InvoiceCreateWithoutItemsInput, InvoiceUncheckedCreateWithoutItemsInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutItemsInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutItemsInput, InvoiceUncheckedUpdateWithoutItemsInput>
  }

  export type InvoiceUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutInvoicesNestedInput
    purchaseOrder?: PurchaseOrderUpdateOneWithoutInvoicesNestedInput
    LRRequest?: LRRequestUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: StringFieldUpdateOperationsInput | string
    poId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    LRRequest?: LRRequestUncheckedUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type VendorCreateWithoutPurchaseOrderInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserCreateNestedManyWithoutVendorInput
    invoices?: InvoiceCreateNestedManyWithoutVendorInput
    Address?: AddressCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestCreateNestedManyWithoutTvendorInput
  }

  export type VendorUncheckedCreateWithoutPurchaseOrderInput = {
    id?: string
    createdAt?: Date | string
    name: string
    contactEmail?: string | null
    contactPhone?: string | null
    gstNumber?: string | null
    panNumber?: string | null
    profileCompleted?: boolean
    taxId?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutVendorInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutVendorInput
    Address?: AddressUncheckedCreateNestedManyWithoutVendorInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutTvendorInput
  }

  export type VendorCreateOrConnectWithoutPurchaseOrderInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutPurchaseOrderInput, VendorUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type UserCreateWithoutPurchaseOrderInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    Vendor?: VendorCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutPurchaseOrderInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    vendorId?: string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPurchaseOrderInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPurchaseOrderInput, UserUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemCreateWithoutPurchaseOrderInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemWhereUniqueInput
    create: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope = {
    data: PurchaseOrderItemCreateManyPurchaseOrderInput | PurchaseOrderItemCreateManyPurchaseOrderInput[]
  }

  export type InvoiceCreateWithoutPurchaseOrderInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    vendor: VendorCreateNestedOneWithoutInvoicesInput
    items?: InvoiceItemCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceUncheckedCreateWithoutPurchaseOrderInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    vendorId: string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
    items?: InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput
    LRRequest?: LRRequestUncheckedCreateNestedManyWithoutInvoiceInput
    InvoiceReference?: InvoiceReferenceUncheckedCreateNestedManyWithoutInvoiceRefernceInput
  }

  export type InvoiceCreateOrConnectWithoutPurchaseOrderInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutPurchaseOrderInput, InvoiceUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type InvoiceCreateManyPurchaseOrderInputEnvelope = {
    data: InvoiceCreateManyPurchaseOrderInput | InvoiceCreateManyPurchaseOrderInput[]
  }

  export type VendorUpsertWithoutPurchaseOrderInput = {
    update: XOR<VendorUpdateWithoutPurchaseOrderInput, VendorUncheckedUpdateWithoutPurchaseOrderInput>
    create: XOR<VendorCreateWithoutPurchaseOrderInput, VendorUncheckedCreateWithoutPurchaseOrderInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutPurchaseOrderInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutPurchaseOrderInput, VendorUncheckedUpdateWithoutPurchaseOrderInput>
  }

  export type VendorUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUpdateManyWithoutVendorNestedInput
    Address?: AddressUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUpdateManyWithoutTvendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    panNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profileCompleted?: BoolFieldUpdateOperationsInput | boolean
    taxId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutVendorNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutVendorNestedInput
    Address?: AddressUncheckedUpdateManyWithoutVendorNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutTvendorNestedInput
  }

  export type UserUpsertWithoutPurchaseOrderInput = {
    update: XOR<UserUpdateWithoutPurchaseOrderInput, UserUncheckedUpdateWithoutPurchaseOrderInput>
    create: XOR<UserCreateWithoutPurchaseOrderInput, UserUncheckedCreateWithoutPurchaseOrderInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPurchaseOrderInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPurchaseOrderInput, UserUncheckedUpdateWithoutPurchaseOrderInput>
  }

  export type UserUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    Vendor?: VendorUpdateOneWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemWhereUniqueInput
    update: XOR<PurchaseOrderItemUpdateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedUpdateWithoutPurchaseOrderInput>
    create: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemWhereUniqueInput
    data: XOR<PurchaseOrderItemUpdateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedUpdateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemScalarWhereInput
    data: XOR<PurchaseOrderItemUpdateManyMutationInput, PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemScalarWhereInput = {
    AND?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
    OR?: PurchaseOrderItemScalarWhereInput[]
    NOT?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
    id?: StringFilter<"PurchaseOrderItem"> | string
    poId?: StringFilter<"PurchaseOrderItem"> | string
    description?: StringFilter<"PurchaseOrderItem"> | string
    quantity?: IntFilter<"PurchaseOrderItem"> | number
    unitPrice?: FloatFilter<"PurchaseOrderItem"> | number
    total?: FloatFilter<"PurchaseOrderItem"> | number
    notes?: StringNullableFilter<"PurchaseOrderItem"> | string | null
    createdAt?: DateTimeFilter<"PurchaseOrderItem"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrderItem"> | Date | string
  }

  export type InvoiceUpsertWithWhereUniqueWithoutPurchaseOrderInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutPurchaseOrderInput, InvoiceUncheckedUpdateWithoutPurchaseOrderInput>
    create: XOR<InvoiceCreateWithoutPurchaseOrderInput, InvoiceUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutPurchaseOrderInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutPurchaseOrderInput, InvoiceUncheckedUpdateWithoutPurchaseOrderInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutPurchaseOrderInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderCreateWithoutItemsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendor: VendorCreateNestedOneWithoutPurchaseOrderInput
    user: UserCreateNestedOneWithoutPurchaseOrderInput
    invoices?: InvoiceCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUncheckedCreateWithoutItemsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendorId: string
    userId: string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderCreateOrConnectWithoutItemsInput = {
    where: PurchaseOrderWhereUniqueInput
    create: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
  }

  export type PurchaseOrderUpsertWithoutItemsInput = {
    update: XOR<PurchaseOrderUpdateWithoutItemsInput, PurchaseOrderUncheckedUpdateWithoutItemsInput>
    create: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
    where?: PurchaseOrderWhereInput
  }

  export type PurchaseOrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: PurchaseOrderWhereInput
    data: XOR<PurchaseOrderUpdateWithoutItemsInput, PurchaseOrderUncheckedUpdateWithoutItemsInput>
  }

  export type PurchaseOrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutPurchaseOrderNestedInput
    user?: UserUpdateOneRequiredWithoutPurchaseOrderNestedInput
    invoices?: InvoiceUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    invoices?: InvoiceUncheckedUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    accounts?: AccountCreateNestedManyWithoutUserInput
    Vendor?: VendorCreateNestedOneWithoutUsersInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    vendorId?: string | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUpdateManyWithoutUserNestedInput
    Vendor?: VendorUpdateOneWithoutUsersNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    Vendor?: VendorCreateNestedOneWithoutUsersInput
    PurchaseOrder?: PurchaseOrderCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
    vendorId?: string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    PurchaseOrder?: PurchaseOrderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Vendor?: VendorUpdateOneWithoutUsersNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type AccountCreateManyUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    scope?: string | null
    password?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
  }

  export type PurchaseOrderCreateManyUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    vendorId: string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PurchaseOrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutPurchaseOrderNestedInput
    items?: PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput
    invoices?: InvoiceUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateManyVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: string
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    phone?: string | null
    companyId?: string | null
  }

  export type InvoiceCreateManyVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    poId?: string | null
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
  }

  export type PurchaseOrderCreateManyVendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    poNumber: string
    poDate: Date | string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    attachments?: string | null
    deliveryDate?: Date | string | null
    deliveryAddress?: string | null
    invoiceCopy?: string | null
    userId: string
  }

  export type AddressCreateManyVendorInput = {
    id?: string
    line1: string
    line2?: string | null
    city: string
    state?: string | null
    postal?: string | null
    country: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LRRequestCreateManyTvendorInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    invoiceId?: string | null
  }

  export type UserUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    PurchaseOrder?: PurchaseOrderUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    PurchaseOrder?: PurchaseOrderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    purchaseOrder?: PurchaseOrderUpdateOneWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    poId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    poId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PurchaseOrderUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutPurchaseOrderNestedInput
    items?: PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput
    invoices?: InvoiceUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    items?: PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    poNumber?: StringFieldUpdateOperationsInput | string
    poDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    attachments?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveryAddress?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceCopy?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AddressUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: StringFieldUpdateOperationsInput | string
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: StringFieldUpdateOperationsInput | string
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AddressUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: StringFieldUpdateOperationsInput | string
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postal?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LRRequestUpdateWithoutTvendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    Invoice?: InvoiceUpdateOneWithoutLRRequestNestedInput
  }

  export type LRRequestUncheckedUpdateWithoutTvendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LRRequestUncheckedUpdateManyWithoutTvendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceItemCreateManyInvoiceInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LRRequestCreateManyInvoiceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleType?: string | null
    vehicleNo?: string | null
    CustomerName?: string | null
    LRNumber: string
    origin?: string | null
    destination?: string | null
    outDate: Date | string
    status?: string | null
    priceOffered?: number | null
    priceSettled?: number | null
    extraCost?: number | null
    fileNumber: string
    remark?: string | null
    isInvoiced?: boolean
    podlink?: string | null
    tvendorId: string
  }

  export type InvoiceReferenceCreateManyInvoiceRefernceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    from: Date | string
    to: Date | string
    dueDate?: Date | string | null
    paidDate?: Date | string | null
  }

  export type InvoiceItemUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceItemUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LRRequestUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    tvendor?: VendorUpdateOneRequiredWithoutLRRequestNestedInput
  }

  export type LRRequestUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    tvendorId?: StringFieldUpdateOperationsInput | string
  }

  export type LRRequestUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleType?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    CustomerName?: NullableStringFieldUpdateOperationsInput | string | null
    LRNumber?: StringFieldUpdateOperationsInput | string
    origin?: NullableStringFieldUpdateOperationsInput | string | null
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    outDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    priceOffered?: NullableFloatFieldUpdateOperationsInput | number | null
    priceSettled?: NullableFloatFieldUpdateOperationsInput | number | null
    extraCost?: NullableFloatFieldUpdateOperationsInput | number | null
    fileNumber?: StringFieldUpdateOperationsInput | string
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    isInvoiced?: BoolFieldUpdateOperationsInput | boolean
    podlink?: NullableStringFieldUpdateOperationsInput | string | null
    tvendorId?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceReferenceUpdateWithoutInvoiceRefernceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceReferenceUncheckedUpdateWithoutInvoiceRefernceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PurchaseOrderItemCreateManyPurchaseOrderInput = {
    id?: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceCreateManyPurchaseOrderInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceNumber?: string | null
    refernceNumber: string
    invoiceDate: Date | string
    vendorId: string
    status?: string
    subtotal?: number
    taxRate?: number
    taxAmount?: number
    grandTotal?: number
    notes?: string | null
    hasDiscrepancy?: boolean
    discrepancyNotes?: string | null
    billTo?: string | null
    billToId?: string | null
    billToGstin?: string | null
    invoiceURI?: string | null
  }

  export type PurchaseOrderItemUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderItemUncheckedUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutInvoicesNestedInput
    items?: InvoiceItemUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
    items?: InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput
    LRRequest?: LRRequestUncheckedUpdateManyWithoutInvoiceNestedInput
    InvoiceReference?: InvoiceReferenceUncheckedUpdateManyWithoutInvoiceRefernceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    refernceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    vendorId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    hasDiscrepancy?: BoolFieldUpdateOperationsInput | boolean
    discrepancyNotes?: NullableStringFieldUpdateOperationsInput | string | null
    billTo?: NullableStringFieldUpdateOperationsInput | string | null
    billToId?: NullableStringFieldUpdateOperationsInput | string | null
    billToGstin?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceURI?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}