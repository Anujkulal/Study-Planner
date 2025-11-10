import { useState, useEffect } from 'react';
import { type StudySession } from '../types';
// import { sessionsAPI } from '../api/sessions';
import { formatDate } from '../lib/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { maxDate, minDate } from '@/constants';
import {useDispatch, useSelector} from "react-redux";
import type { AppDispatch, RootState } from '@/redux/store';
import { addSession, updateSession } from '@/redux/slices/sessionSlice';

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: StudySession | null;
  defaultDay: string | null;
  onSave: () => void;
}

/**
 * 
 * @description This dialog modal is used for both creating and editing sessions
 * @returns 
 */

export const SessionDialog = ({
  open,
  onOpenChange,
  session,
  defaultDay,
  onSave,
}: SessionDialogProps) => {
  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    duration: '60',
    notes: '',
    day: defaultDay || formatDate(new Date()),
    status: 'pending' as 'completed' | 'pending',
  });

  const dispatch = useDispatch<AppDispatch>();
  const {loading, success } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    // console.log('SessionDialog session changed:', session);
    if (session) {
      setFormData({
        subject: session.subject,
        duration: session.duration.toString(),
        notes: session.notes || '',
        day: session.day,
        status: session.status,
      });
    } else if (defaultDay) {
      setFormData(prev => ({ ...prev, day: defaultDay }));
    }
  }, [session, defaultDay, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      toast.error('Subject is required');
      return;
    }

    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration <= 0) {
        toast.error('Duration must be a positive number');
      return;
    }

    // setLoading(true);
    try {
      if (session) {
        // await sessionsAPI.updateSession(session.id, {
        //   subject: formData.subject,
        //   duration,
        //   notes: formData.notes,
        //   day: formData.day,
        //   status: formData.status,
        // });
        dispatch(updateSession({
          id: session.id,
          updates: {
            subject: formData.subject,
            duration,
            notes: formData.notes,
            day: formData.day,
            status: formData.status,
          }
        })).unwrap();
        // clearSessionState();
        // toast.success(success);
      } else {
        // await sessionsAPI.createSession({
        //   subject: formData.subject,
        //   duration,
        //   notes: formData.notes,
        //   day: formData.day,
        //   status: formData.status,
        // });
        dispatch(addSession({
          subject: formData.subject,
          duration,
          notes: formData.notes,
          day: formData.day,
          status: formData.status,
        })).unwrap();
        // clearSessionState();
        console.log("added::: ", success)
        // toast.success(success);
      }
      onSave();
      resetForm();
    } catch (error) {
        // toast.error('Failed to save session');
        console.error('Failed to save session:', error);
    } finally {
      // setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      duration: '60',
      notes: '',
      day: formatDate(new Date()),
      status: 'pending',
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogContent className="sm:max-w-[500px] backdrop-blur-lg bg-zinc-100/60 dark:bg-zinc-900/10 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{session ? 'Edit' : 'Add'} Study Session</DialogTitle>
          <DialogDescription>
            {session ? 'Update your study session details' : 'Create a new study session'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" >
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e: any) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Mathematics, Physics"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {session ? (
                <Select
                  value={formData.status}
                  onValueChange={(value: 'completed' | 'pending') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="status"
                  value={formData.status}
                  disabled
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day">Date *</Label>
            <Input
              id="day"
              type="date"
              min={minDate.toISOString().split('T')[0]}
              max={maxDate.toISOString().split('T')[0]}
              value={formData.day}
              onChange={(e: any) => setFormData({ ...formData, day: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : session ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};