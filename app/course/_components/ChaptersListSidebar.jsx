import React, { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";

function ChaptersListSidebar({ courseInfo }) {
  const course = courseInfo?.course;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterIndexContext,
  );
  let completedChapters = enrollCourse?.completedChapters ?? [];

  return (
    <div className="w-180 min-w-80 bg-secondary h-screen p-5 sticky top-0">
      <h2 className="my-3 font-bold text-xl">
        Chapters ({courseContent?.length})
      </h2>

      <Accordion type="single">
        {courseContent?.map((chapter, index) => (
          <AccordionItem
            value={chapter?.courseData?.chapterName}
            key={index}
            onClick={() => setSelectedChapterIndex(index)}
          >
            <AccordionTrigger
              className={`text-lg font-medium px-5 ${completedChapters?.includes(index) ? "bg-green-500 text-white px-2 rounded-lg" : ""}`}
            >
              {index + 1}. {chapter?.courseData?.chapterName}
            </AccordionTrigger>
            <AccordionContent>
              <div>
                {chapter?.courseData?.topics?.map((topic, index_) => (
                  <h2
                    key={index_}
                    className={`p-3 my-1 rounded-lg ${completedChapters?.includes(index) ? "bg-green-500 text-white" : "bg-white"}`}
                  >
                    {completedChapters?.includes(index) && "✓ "}
                    {topic?.topic}
                  </h2>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default ChaptersListSidebar;
