import React, { ReactElement, useState } from "react";
import { Observable, Subject } from "rxjs";
import { isLnd } from "../../common/utils/currencyUtil";
import ErrorMessage from "../../common/components/data-display/ErrorMessage";
import Loader from "../../common/components/data-display/loader/Loader";
import { Info } from "../../models/Info";
import BoltzDeposit from "./BoltzDeposit";
import ConnextDeposit from "./ConnextDeposit";

type DepositProps = {
  currency: string;
  refreshSubject: Subject<void>;
  getInfo$: Observable<Info>;
};

const Deposit = (props: DepositProps): ReactElement => {
  const { currency, refreshSubject, getInfo$ } = props;
  const [error, setError] = useState("");
  const [fetchingData, setFetchingData] = useState(true);

  return (
    <>
      {!!error && <ErrorMessage details={error} />}
      {!error && fetchingData && <Loader />}
      {!error && isLnd(currency) ? (
        <BoltzDeposit
          currency={currency}
          refreshSubject={refreshSubject}
          getInfo$={getInfo$}
          setError={setError}
          setFetchingData={setFetchingData}
        />
      ) : (
        <ConnextDeposit
          currency={currency}
          getInfo$={getInfo$}
          setError={setError}
          setFetchingData={setFetchingData}
        />
      )}
    </>
  );
};

export default Deposit;
