import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export type AlertDialogProps = {
    open: boolean
    question: string
    onClose: () => void
    onAgree: () => void
}
export default function AlertDialog({ open, question, onClose, onAgree }: AlertDialogProps) {
  return (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Veuillez confirmer votre action
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {question}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={onAgree} autoFocus>Confirmer</Button>
    </DialogActions>
    </Dialog>
  );
}
