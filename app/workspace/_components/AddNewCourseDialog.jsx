import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Sparkle } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

function AddNewCourseDialog({ children }) {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    noOfChapters: 1,
    includeVideo: false,
    level: '',
    category: ''
  });
  const router = useRouter();

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(formData);
  }

  const onGenerate=async ()=>{
    console.log(formData);
    const courseId = uuidv4();
    try{
    setLoading(true);
    const result = await axios.post('/api/generate-course-layout', {
      ...formData,
      courseId: courseId
    });
    console.log(result.data);
    setLoading(false);
    router.push('/workspace/edit-course/' + result.data?.courseId);
  }catch(e){
    setLoading(false);
    console.log(e);
  }
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course Using AI</DialogTitle>
          <div className="flex flex-col gap-4 mt-3">
            <div>
              <label>Course Name</label>
              <Input placeholder="Course Name"
                onChange={(e) => onHandleInputChange('name', e.target.value)} />
            </div>
            <div>
              <label>Course Description (Optional)</label>
              <Textarea placeholder="Course Description"
                onChange={(e) => onHandleInputChange('description', e.target.value)} />
            </div>
            <div>
              <label>No. Of Chapters</label>
              <Input placeholder="No of chapters" type="number"
                onChange={(e) => onHandleInputChange('noOfChapters', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <label>Include Video</label>
              <Switch onCheckedChange={(value) => onHandleInputChange('includeVideo', !formData?.includeVideo)} />
            </div>
            <div>
              <label>Difficulty Level</label>
              <Select className='mt-1' onValueChange={(value) => onHandleInputChange('level', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label>Category</label>
              <Input placeholder="Category (Separated by commas)"
                onChange={(e) => onHandleInputChange('category', e.target.value)} />
            </div>
            <div className='mt-5'>
              <Button className={'w-full'} onClick={onGenerate} disabled={loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : <Sparkle />}
                Generate Course
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;