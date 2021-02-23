import React, { ReactElement, useState } from "react";
import api from "../../../api";
import ButtonWithLoading from "../../../common/components/input/buttons/ButtonWithLoading";
import { getErrorMsg } from "../../../common/utils/errorUtil";
import { CancelledOrder, OrderRow } from "./OpenOrders";

type CancelOrderProps = {
  row: OrderRow;
  cancelledOrders: CancelledOrder;
  setCancelledOrders: (value: React.SetStateAction<CancelledOrder>) => void;
};

const CancelOrder = (props: CancelOrderProps): ReactElement => {
  const { row, cancelledOrders, setCancelledOrders } = props;
  const [loading, setLoading] = useState(false);

  const isPending = (row: OrderRow): boolean => {
    const cancelledOrder = cancelledOrders.get(row.orderId);
    return !!cancelledOrder?.pending || loading;
  };

  return (
    <ButtonWithLoading
      fullWidth
      text="Cancel"
      disabled={isPending(row)}
      loading={isPending(row)}
      size="small"
      onClick={() => {
        setLoading(true);
        setCancelledOrders((oldValue) =>
          oldValue.set(row.orderId, {
            pending: true,
            error: "",
          })
        );
        api
          .removeOrder$({
            orderId: row.orderId,
          })
          .subscribe({
            next: () => {},
            error: (err) => {
              setLoading(false);
              setCancelledOrders((oldValue) =>
                oldValue.set(row.orderId, {
                  pending: false,
                  error: getErrorMsg(err),
                })
              );
            },
          });
      }}
      error={true}
      helperText={cancelledOrders.get(row.orderId)?.error}
    />
  );
};

export default CancelOrder;
