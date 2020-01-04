import React, {FunctionComponent, useState} from 'react';
import {Formik, FormikHelpers} from 'formik';
import {setsValidation} from './SetsHelpers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../Formik/FormikField';
// @ts-ignore
import {Form} from 'react-formik-ui';
import {Button, ButtonGroup} from 'reactstrap';
import {ISetBasicModel} from '../../models/ISetModel';
import {SetTypesEnum} from '../../enums/SetTypesEnum';
import {getCurrentUsersUid} from '../../config/FirebaseUtils';
import {addNewSetSecondsAndGetUid, addSetSecondsToSetsSecondsExerciseArray} from './SetsSeconds/SetsSecondsService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {addNewSetAndGetUid, addSetToSetsRepsExerciseArray} from './SetsReps/SetsRepsService';
import {useTranslation} from 'react-i18next';

const SetsTableRowFormRender: FunctionComponent<ISetsTableRowFormRender> = ({initialData, editOnSubmit, setAddSetViewVisible, setTypeShown, exerciseUid}) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsTableRowFormRender"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicModel = {
        index: values.index,
        amountInKg: values.amountInKg,
      };

      if (setTypeShown === SetTypesEnum.SET_TYPE_SECONDS) {
        data.seconds = values.seconds;
      } else if (setTypeShown === SetTypesEnum.SET_TYPE_REPS) {
        data.reps = values.reps;
      }

      const ownerUid = await getCurrentUsersUid();

      if (setTypeShown === SetTypesEnum.SET_TYPE_SECONDS) {
        const uid = await addNewSetSecondsAndGetUid(data, ownerUid);
        await addSetSecondsToSetsSecondsExerciseArray(uid, exerciseUid);
      } else if (setTypeShown === SetTypesEnum.SET_TYPE_REPS) {
        const uid = await addNewSetAndGetUid(data, ownerUid);
        await addSetToSetsRepsExerciseArray(uid, exerciseUid);
      }

      // Hide this form
      setAddSetViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialData}
      onSubmit={editOnSubmit || onSubmit}
      validate={(values: any) => {
        return setsValidation(values, t);
      }}
      render={({errors, isSubmitting}) => (
        <>
          {isSubmitting && <tr><td colSpan={3} className="text-center"><FontAwesomeIcon icon="spinner" spin/></td></tr>}
          {!isSubmitting && <>
            <tr>
              <th className="align-middle" scope="row">{initialData.index}</th>
              <td>
                <FormikField name="amountInKg" labelText={t("Amount in KG")} type="number" labelHidden inputProps={{min: 0, autoFocus: true}}/>
              </td>
              {setTypeShown === SetTypesEnum.SET_TYPE_REPS && <td>
                <FormikField name="reps" labelText={t("Repetitions")} type="number" labelHidden inputProps={{min: 0}}/>
              </td>}
              {setTypeShown === SetTypesEnum.SET_TYPE_SECONDS && <td>
                <FormikField name="seconds" labelText={t("Seconds")} type="number" labelHidden inputProps={{min: 0}}/>
              </td>}
            </tr>
            <tr>
              <td colSpan={3}>
                <Form mode='structured'>
                  <ButtonGroup className="w-100">
                    <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save set")}</Button>
                    <Button color="danger" onClick={() => setAddSetViewVisible(false)}>{t("Discard set")}</Button>
                  </ButtonGroup>
                </Form>
              </td>
            </tr>
          </>}
        </>
      )}
    />
  );
};

interface ISetsTableRowFormRender {
  initialData: ISetBasicModel,
  editOnSubmit?: ((values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => void),
  setAddSetViewVisible: ((visible: boolean) => void),
  setTypeShown: SetTypesEnum,
  exerciseUid: string,
}

export default SetsTableRowFormRender;
