import React, { useContext, useState } from "react";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle, Loader2Icon, X } from "lucide-react";

function ChapterContent({ courseInfo, refreshData }) {
  const {courseId} = useParams();
  const { course, enrollCourse } = courseInfo ?? "";
  const courseContent = courseInfo?.courses?.courseContent;

  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterIndexContext,
  );

  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
  let completedChapters = enrollCourse?.completedChapters ?? [];
  const [loading,setLoading]=useState(false);

  const markChapterCompleted = async () => {
        setLoading(true);
        completedChapters.push(selectedChapterIndex);
        const result = await axios.put('/api/enroll-course',{
            courseId: courseId,
            completedChapters: completedChapters
        });
        console.log(result);
        refreshData();
        toast.success('Chapter Marked as Completed!');
        setLoading(false);
  };
  const markInCompleteChapter = async () => {
  setLoading(false);
  const completeChap = completedChapters.filter(item => item != selectedChapterIndex);
  const result = await axios.put('/api/enroll-course', {
    courseId: courseId,
    completedChapters: completeChap
  });
  console.log(result);
  refreshData();
  toast.success('Chapter Marked InCompleted!');
  setLoading(false);
};

  return (
    <div className="p-10">
      <div className='flex justify-between items-center'>
      <h2 className="font-bold text-2xl">
        {selectedChapterIndex + 1}.{" "}
        {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
      </h2>
      {!completedChapters?.includes(selectedChapterIndex) ? (
        <Button onClick={() => markChapterCompleted()} disabled={loading}>
            {loading ? <Loader2Icon className='animate-spin' /> : <CheckCircle />}
            Mark as Completed
        </Button>
        ) : (
        <Button variant="outline" onClick={markInCompleteChapter} disabled={loading}>
            {loading ? <Loader2Icon className='animate-spin' /> : <X />} Mark incomplete
        </Button>
        )}
      </div>

      <h2 className="my-2 font-bold text-lg">Related Videos 🎥</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {videoData?.map(
          (video, index) =>
            index < 2 && (
              <div key={index}>
                <YouTube
                  videoId={video?.videoId}
                  opts={{
                    height: "250",
                    width: "400",
                  }}
                />
              </div>
            ),
        )}
      </div>

      <div className="mt-7">
        {topics?.map((topic, index) => (
          <div key={index} className="mt-10 p-5 bg-secondary rounded-2xl">
            <h2 className="font-bold text-2xl text-primary">
              {index + 1}. {topic?.topic}
            </h2>
            {/* <p>{topic?.content}</p> */}
            <div
              dangerouslySetInnerHTML={{ __html: topic?.content }}
              style={{
                lineHeight: "2",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterContent;
