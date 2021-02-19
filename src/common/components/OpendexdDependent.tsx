import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import ViewDisabled from "../../dashboard/ViewDisabled";
import { ServiceStore, SERVICE_STORE } from "../../stores/serviceStore";
import Loader from "./data-display/loader/Loader";

type OpendexdDependentProps = {
  comp: ReactElement;
  serviceStore?: ServiceStore;
};

/**
 * In case a component needs opendexd to be ready and unlocked,
 * information from opendexd status is displayed when those conditions are not met.
 *
 * @param comp
 * a component to display when opendexd is ready and unlocked
 */
const OpendexdDependent = inject(SERVICE_STORE)(
  observer(
    (props: OpendexdDependentProps): ReactElement => {
      const { comp, serviceStore } = props;

      return (
        <>
          {serviceStore!.opendexdStatus ? (
            !serviceStore!.opendexdLocked && serviceStore!.opendexdReady ? (
              comp
            ) : (
              <ViewDisabled
                opendexdLocked={serviceStore!.opendexdLocked}
                opendexdStatus={serviceStore!.opendexdStatus.status}
              />
            )
          ) : (
            <Loader />
          )}
        </>
      );
    }
  )
);

export default OpendexdDependent;
