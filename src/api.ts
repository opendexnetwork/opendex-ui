import { from, fromEvent, Observable, of, throwError } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import io from "socket.io-client";
import { logError } from "./common/utils/appUtil";
import { BackupInfo } from "./models/BackupInfo";
import { CreateReverseSwapRequest } from "./models/CreateReverseSwapRequest";
import { CreateReverseSwapResponse } from "./models/CreateReverseSwapResponse";
import { DepositResponse } from "./models/DepositResponse";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { GetMnemonicResponse } from "./models/GetMnemonicResponse";
import { GetServiceInfoResponse } from "./models/GetServiceInfoResponse";
import { Info } from "./models/Info";
import { ListordersParams } from "./models/ListordersParams";
import { ListordersResponse } from "./models/ListordersResponse";
import { ListpairsResponse } from "./models/ListpairsResponse";
import { OrderBookParams } from "./models/OrderBookParams";
import { OrderBookResponse } from "./models/OrderBookResponse";
import { PlaceOrderParams } from "./models/PlaceOrderParams";
import { RemoveOrderParams } from "./models/RemoveOrderParams";
import { SetupStatusResponse } from "./models/SetupStatusResponse";
import { Status } from "./models/Status";
import { TradehistoryResponse } from "./models/TradehistoryResponse";
import { TradinglimitsResponse } from "./models/TradinglimitsResponse";

const url =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL
    : window.location.origin;
const path = `${url}/api/v1`;
const opendexdPath = `${path}/opendexd`;
const boltzPath = `${path}/boltz`;

const logErr = (url: string, err: string): void => {
  const errorMsg = typeof err === "string" ? err : JSON.stringify(err);
  logError(`requestUrl: ${url}; error: ${errorMsg}`);
};

const logAndThrow = (url: string, err: string) => {
  logErr(url, err);
  throw err;
};

const fetchJsonResponse = <T>(
  url: string,
  body?: BodyInit,
  params?: Record<string, any>,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
): Observable<T> => {
  const queryUrl = new URL(url);
  if (params) {
    queryUrl.search = new URLSearchParams(params).toString();
  }
  return from(fetch(queryUrl.toString(), { method, body })).pipe(
    mergeMap((resp: Response) =>
      resp.status === 204
        ? of({})
        : from(resp.json()).pipe(
            mergeMap((body) => (resp.ok ? of(body) : throwError(body)))
          )
    ),
    catchError((err) => logAndThrow(url, err))
  );
};

const fetchStreamResponse = <T>(url: string): Observable<T | null> => {
  return new Observable((subscriber) => {
    fetch(url)
      .then((response) => {
        if (!response.body) {
          subscriber.next(null);
          return;
        }
        const reader = response.body.getReader();

        const processText = ({
          done,
          value,
        }: any): Promise<
          | ReadableStreamReadResult<T>
          | ReadableStreamReadDoneResult<T>
          | undefined
        > => {
          if (done) {
            subscriber.complete();
            return Promise.resolve(undefined);
          }

          const stringValue = new TextDecoder("utf-8").decode(value);
          const items = stringValue
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => !!item);
          const newestItem = items[items.length - 1];
          try {
            const jsonValue = JSON.parse(newestItem);
            subscriber.next(jsonValue);
          } catch (err) {
            subscriber.next(null);
          }
          return reader.read().then(processText);
        };

        reader.read().then(processText);
      })
      .catch((e) => {
        logErr(url, e);
        subscriber.error(e);
      });
  });
};

const io$: Observable<SocketIOClient.Socket> = of(
  io(url!, {
    path: "/socket.io/",
    transports: ["websocket"],
  })
);

export default {
  setupStatus$(): Observable<SetupStatusResponse | null> {
    const requestUrl = `${path}/setup-status`;
    return fetchStreamResponse(requestUrl);
  },

  status$(): Observable<Status[]> {
    return fetchJsonResponse(`${path}/status`);
  },

  statusByService$(serviceName: string): Observable<Status> {
    return fetchJsonResponse(`${path}/status/${serviceName}`);
  },

  logs$(serviceName: string): Observable<string> {
    const requestUrl = `${path}/logs/${serviceName}`;
    return from(fetch(requestUrl)).pipe(
      mergeMap((resp) => resp.text()),
      catchError((err) => logAndThrow(requestUrl, err))
    );
  },

  getinfo$(): Observable<Info> {
    return fetchJsonResponse(`${opendexdPath}/getinfo`);
  },

  getbalance$(): Observable<GetbalanceResponse> {
    return fetchJsonResponse(`${opendexdPath}/getbalance`);
  },

  tradinglimits$(): Observable<TradinglimitsResponse> {
    return fetchJsonResponse(`${opendexdPath}/tradinglimits`);
  },

  tradehistory$(): Observable<TradehistoryResponse> {
    return fetchJsonResponse(`${opendexdPath}/tradehistory`);
  },

  listpairs$(): Observable<ListpairsResponse> {
    return fetchJsonResponse(`${opendexdPath}/listpairs`);
  },

  listorders$(params: ListordersParams): Observable<ListordersResponse> {
    return fetchJsonResponse(`${opendexdPath}/listorders`, undefined, params);
  },

  orderbook$(params: OrderBookParams): Observable<OrderBookResponse> {
    return fetchJsonResponse(`${opendexdPath}/orderbook`, undefined, params);
  },

  placeOrder$(params: PlaceOrderParams): Observable<void> {
    return fetchJsonResponse(
      `${opendexdPath}/placeorder`,
      JSON.stringify(params),
      undefined,
      "POST"
    );
  },

  removeOrder$(params: RemoveOrderParams): Observable<void> {
    return fetchJsonResponse(
      `${opendexdPath}/removeorder`,
      JSON.stringify(params),
      undefined,
      "POST"
    );
  },

  boltzDeposit$(currency: string): Observable<DepositResponse> {
    return fetchJsonResponse(`${boltzPath}/deposit/${currency.toLowerCase()}`);
  },

  boltzServiceInfo$(currency: string): Observable<GetServiceInfoResponse> {
    return fetchJsonResponse(
      `${boltzPath}/service-info/${currency.toLowerCase()}`
    );
  },

  boltzWithdraw$(
    currency: string,
    data: CreateReverseSwapRequest
  ): Observable<CreateReverseSwapResponse> {
    const msgBody: FormData = new FormData();
    msgBody.append("amount", data.amount.toString());
    msgBody.append("address", data.address);
    return fetchJsonResponse(
      `${boltzPath}/withdraw/${currency.toLowerCase()}`,
      msgBody,
      undefined,
      "POST"
    );
  },

  unlock$(password: string): Observable<void> {
    return fetchJsonResponse(
      `${opendexdPath}/unlock`,
      JSON.stringify({ password }),
      undefined,
      "POST"
    );
  },

  changePassword$(newPassword: string, oldPassword: string): Observable<void> {
    return fetchJsonResponse(
      `${opendexdPath}/changepass`,
      JSON.stringify({ newPassword, oldPassword }),
      undefined,
      "POST"
    );
  },

  getMnemonic$(): Observable<GetMnemonicResponse> {
    return fetchJsonResponse(`${opendexdPath}/getmnemonic`);
  },

  updateBackupDirectory$(location: string): Observable<void> {
    return fetchJsonResponse(
      `${path}/backup`,
      JSON.stringify({ location }),
      undefined,
      "PUT"
    );
  },

  getBackupInfo$(): Observable<BackupInfo> {
    return fetchJsonResponse(`${path}/info`);
  },

  sio: {
    io$,
    console$(id: string): Observable<any> {
      return io$.pipe(mergeMap((io) => fromEvent(io, `console.${id}.output`)));
    },
  },
};
