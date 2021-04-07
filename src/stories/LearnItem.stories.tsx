import React from "react";
import { storiesOf } from "@storybook/react";
import LearnItem from "../dashboard/learn/LearnItem";

storiesOf("LearnItem", module).add("LearnItemDefault", () => (
  <LearnItem
    videoId={"EGmR676jMt8"}
    title={"Community Call #19 (2021-03-24)"}
  />
));
