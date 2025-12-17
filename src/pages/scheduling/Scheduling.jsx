/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { Button, Loading } from "../../components/commons";
import useMainStore from "../../store/useMainStore";
import { errorToaster } from "../../utils/toaster";
import { extensionId } from "../../utils/config";
import { checkExtensionInstalled } from "../../utils/helpers";
import { format } from 'date-fns';

function convertTo12HourFormat(time) {
  let [hours, minutes] = time.split(":");
  let suffix = "AM";
  hours = parseInt(hours);

  if (hours >= 12) {
    suffix = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes} ${suffix}`;
}

const ScheduleComponent = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const { data, postList, deletePost } = useMainStore();

  useEffect(() => {
    const handlePostComplete = async (event) => {
      const { data: eventData } = event;
      if (eventData?.type !== "POST_DELETE") {
        setLoading(false);
        return;
      }
      if (eventData && !eventData.success) {
        setLoading(false);
        errorToaster(
          eventData.message || "LinkedIn post failed with unknown error."
        );
        return;
      }

      const { id } = eventData;
      const result = await deletePost(id);

      setLoading(false);
      if (!result) return console.log("Delete post is not avaible");
      const remainingSchedules = schedules.filter(
        (schedule) => schedule.id !== id
      );
      setSchedules(remainingSchedules);
      setFilteredSchedules(remainingSchedules);
    };

    window.addEventListener("message", handlePostComplete);
    return () => window.removeEventListener("message", handlePostComplete);
  }, [schedules]);

  const [toDateSelect, setToDateSelect] = useState("");
  const [fromDateSelect, setFromDateSelect] = useState("");

  const resetFilter = () => {
    setSearchDate("");
    setFilteredSchedules(schedules);
    setCurrentPage(1);
    setToDateSelect("");
    setFromDateSelect("");
  };

  // const handleDelete = async (schedule) => {
    
  //   setLoading(true);
  //   try {
  //     const isExtensionActive = await checkExtensionInstalled(extensionId);
  //     if (!isExtensionActive) {
  //       throw new Error("Extension is not active");
  //     }
  //     console.log(schedule?.linkedin_postid,'--schedule?.linkedin_postid--',schedule?.id);
  //     chrome.runtime.sendMessage(
  //       extensionId,
  //       {
  //         action: "DELETEPOST",
  //         content: { shareUrn: schedule?.linkedin_postid, 
  //             id: schedule?.id,
  //             email: userEmail,
  //             post_id : schedule?.id,
  //             token : localToken,
  //             postType : ''
  //         },
  //       },
  //       () => { }
  //     );
  //   } catch (error) {
  //     console.error(error.message);
  //     setLoading(false);
  //     errorToaster(
  //       "LinkedIn extension not found or message could not be sent.."
  //     );
  //   }
  // };

  // Pagination logic
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current schedules for the current page
  const indexOfLastSchedule = currentPage * itemsPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule
  );

  const handleStatus = (status) => {
    switch (status) {
      case "processed":
        return { status: "Processed", class: 'bg-[blue]' }
      case "success":
        return { status: "Success", class: 'bg-[green]' }
      case "failed":
        return { status: "Failed", class: 'bg-[red]' }
      default:
        return { status: "Processed", class: 'bg-[#808080]' }
    }
  }

  const getScheduleList = async (data) => {
    setLoading(true);
    try {
      const payload = {
        user_id: data?.user_id,
        up_coming: data?.up_coming,
        to_date: data?.to_date,
        from_date: data?.from_date
      };
      const result = await postList(payload);
      if (!result || !result.data)
        return console.warn("Failed to list of posts");

      const sortByLatestDateTime = (posts) => {
        return posts.sort((a, b) => {
          const dateTimeA = new Date(`${a.post_date}T${a.post_time}`);
          const dateTimeB = new Date(`${b.post_date}T${b.post_time}`);

          return dateTimeA - dateTimeB;
        });
      };

      const sortedPosts = sortByLatestDateTime(result.data);
      setSchedules(sortedPosts);
      setFilteredSchedules(sortedPosts);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  }

  // ################
  const handleFromDateChange = (value) => {
    setFromDateSelect(value);
    if (toDateSelect && new Date(value) < new Date(toDateSelect)) {
      setToDateSelect("");
    }
    if (!toDateSelect?.trim()) {
      setToDateSelect("");
    }
  };

  const handleToDateChange = (value) => {
    setToDateSelect(value);
    if (fromDateSelect && new Date(value) > new Date(fromDateSelect)) {
      setFromDateSelect("");
    }
    if (!fromDateSelect?.trim()) {
      setFromDateSelect("");
    }
  };

useEffect(() => {
  const fetchData = async () => {
    const payload = {
      user_id: data?.settings?.id,
      up_coming: true,
      to_date: toDateSelect || '', // Send empty string if toDateSelect is not set
      from_date: fromDateSelect || '' // Send empty string if fromDateSelect is not set
    };

    if ((!toDateSelect && !fromDateSelect) || (toDateSelect && fromDateSelect)) {
      await getScheduleList(payload);
    }
  };

  fetchData();
}, [toDateSelect, fromDateSelect, data?.settings?.id]);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg md:min-h-[calc(100vh-145px)] w-full">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">
        Schedule Management
      </h1>

      {loading && <Loading />}

      {/* Search Filter by Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
        <div className="flex gap-3">
          <div className="flex gap-3">
            <div className="to-date flex gap-3 items-center">
              <input
                type="date"
                value={toDateSelect}
                onChange={(e) => handleToDateChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8979FD] w-full sm:w-auto"
              />
              <p>To</p>
            </div>
            <div className="from-date flex gap-3 items-center">
              <input
                type="date"
                value={fromDateSelect}
                onChange={(e) => handleFromDateChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8979FD] w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={resetFilter}
          className="px-4 py-2 w-full sm:w-auto text-white bg-[#614bfb] hover:bg-[#8979FD] rounded-lg shadow-md"
        >
          Reset
        </Button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto border-collapse mb-6 border border-gray-300 text-[12px] sm:text-sm">
          <thead className="bg-primary-color text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left">Title</th>
              <th className="px-2 sm:px-4 py-2 text-left">Schedule Date</th>
              <th className="px-2 sm:px-4 py-2 text-left">Created At</th>
              <th className="px-2 sm:px-4 py-2 text-left">Type</th>
              <th className="px-2 sm:px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentSchedules.length > 0 ? (
              currentSchedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td
                    className="px-2 sm:px-4 py-2 truncate max-w-[200px]"
                    title={schedule.topic}
                  >
                    {schedule.topic || "no title"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    {`${schedule.post_date} ${convertTo12HourFormat(
                      schedule?.post_time
                    )}`}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    {format(new Date(schedule?.created_at), "yyyy-MM-dd h:mm a")}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    {schedule?.publish_type === "1" ? "Schedule" : "Post"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 capitalize">
                    <div className={`px-[10px] py-[2px] text-[14px] ${handleStatus(schedule?.status).class} w-[max-content] text-white rounded-[3px]`}>
                      {handleStatus(schedule?.status)?.status || "N/A"}
                    </div>
                    {schedule?.status === "failed" && (
                      <span className="text-[red] text-[12px] mt-[5px]">{schedule?.message}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 text-sm font-medium"
                >
                  No scheduled posts found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {filteredSchedules.length > itemsPerPage && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {Array.from(
            { length: Math.ceil(filteredSchedules.length / itemsPerPage) },
            (_, index) => (
              <Button
                key={index}
                className={`px-3 py-1 sm:px-4 sm:py-2 text-sm font-semibold rounded-md ${currentPage === index + 1
                  ? "bg-primary-color text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleComponent;

// const fetchSchedules = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         { id: 1, title: "Meeting", date: "2025-03-30" },
//         { id: 2, title: "Doctor's Appointment", date: "2025-03-31" },
//         { id: 3, title: "Conference", date: "2025-04-01" },
//         { id: 4, title: "Team Sync", date: "2025-04-05" },
//         { id: 5, title: "Client Call", date: "2025-04-06" },
//         { id: 6, title: "Workshop", date: "2025-04-10" },
//         { id: 7, title: "Homie", date: "2025-04-10" },
//         { id: 8, title: "womie", date: "2025-04-10" },
//         { id: 9, title: "Team Sync", date: "2025-04-05" },
//         { id: 10, title: "Client Call", date: "2025-04-06" },
//         { id: 11, title: "Workshop", date: "2025-04-10" },
//         { id: 12, title: "Homie", date: "2025-04-10" },
//         { id: 13, title: "womie", date: "2025-04-10" },
//         { id: 14, title: "Team Sync", date: "2025-04-05" },
//         { id: 15, title: "Client Call", date: "2025-04-06" },
//         { id: 16, title: "Workshop", date: "2025-04-10" },
//         { id: 17, title: "Homie", date: "2025-04-10" },
//         { id: 18, title: "womie", date: "2025-04-10" },
//       ]);
//     }, 1000);
//   });
// };
