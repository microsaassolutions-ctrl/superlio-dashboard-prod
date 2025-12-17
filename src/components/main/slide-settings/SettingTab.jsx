import React, { useState } from "react";
import { Button, Checkbox, Input } from "../../commons";
import useMainStore from "../../../store/useMainStore";
import { saveWhiteIcon } from "../../../assets/images";

const SettingsTab = () => {
  const { data, setData, saveHandle } = useMainStore();
  const handler = useMainStore((state) => state.data.settings.handle);
  const [handle, setHandle] = useState(handler);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChanges = (key) => {
    setData(`settings.${key}`, !data.settings[key]);
  };

  const changeHandler = (e) => {
    setHandle(e.target.value);
    // setData("settings.handle", e.target.value)
  }

  const handleClick = async () => {
    setLoading(true);
    try {
      await saveHandle(handle);
    } catch (error) {
      console.error("Failed to save handle:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="flex justify-between items-center">
        Headshot
        <Checkbox
          checked={data?.settings?.showHeadshot}
          onChange={() => handleCheckboxChanges("showHeadshot")}
          custom
          color="#FF5733"
        />
      </div>
      <hr className="mt-2 mb-5 text-[#c8c8c8]" />

      <div className="flex justify-between items-center">
        Name
        <Checkbox
          checked={data?.settings?.showName}
          onChange={() => handleCheckboxChanges("showName")}
          custom
          color="#FF5733"
        />
      </div>
      <hr className="mt-2 mb-5 text-[#c8c8c8]" />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          My Handle
          <Checkbox
            checked={data?.settings?.showHandle}
            onChange={() => handleCheckboxChanges("showHandle")}
            custom
            color="#FF5733"
          />
        </div>
        {/* <Input
          type="text"
          value={handle}
          onChange={changeHandler}
          className=""
        /> */}
        <div className="flex items-center justify-center w-full bg-white border-[2px] border-[#614bfb] rounded-lg overflow-hidden">
          <Input
            value={handle}
            onChange={changeHandler}
            placeholder="Enter Handle Here"
            disabled={loading}
            className="flex-1 p-2 text-lg outline-none box-border flex-grow min-w-[100px] w-[100%]"
            style={{ border: "none" }}
          />
          <Button
            type="custom"
            icon={<img src={saveWhiteIcon} className="w-[22px] h-[22px]"/>}
            iconPosition="left"
            onClick={handleClick}
            title="Save Handle"
            disabled={loading}
            className={`bg-primary-color text-white px-[8px] py-[8px] max-w-fit mr-1 text-lg flex items-center gap-2 transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#8979FD]"
              }`}
          />
        </div>
      </div>
      <hr className="mt-2 mb-5 text-[#c8c8c8]" />
    </>
  );
};

export default SettingsTab;
