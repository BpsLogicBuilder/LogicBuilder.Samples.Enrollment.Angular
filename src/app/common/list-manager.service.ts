import { Service } from '@angular/core';
import { EntityType } from '../stuctures/screens/i-base-model';
import { EntityStateType } from '../stuctures/screens/entity-state-type';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { IFormItemSetting, abstractControlKind, IGroupBoxSettings, IFormGroupSettings, IFormGroupArraySettings, IMultiSelectFormControlSettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Service()
export class ListManagerService {
public updateFormEntityState(entityToSave: EntityType, originalEntity: EntityType, formGroup: UntypedFormGroup, fieldSettings: IFormItemSetting[], isInsert: boolean = false): EntityType {
        if (!formGroup.dirty) {
            entityToSave.entityState = EntityStateType.Unchanged;
        }
        else if ((!originalEntity) || isInsert) {
            entityToSave.entityState = EntityStateType.Added;
            for (let setting of fieldSettings) {
                this.setcHILDEntityStateForNewEntity(entityToSave, originalEntity, formGroup, setting);
            }
        }
        else {//entityToSave = instructor
            entityToSave.entityState = EntityStateType.Modified;
            for (let setting of fieldSettings) {
                this.setChildEntityStateForModifiedEntity(entityToSave, originalEntity, formGroup, setting);
            }
        }

        return entityToSave;
    }

    private setcHILDEntityStateForNewEntity(entityToSave: EntityType, originalEntity: EntityType, formGroup: UntypedFormGroup, setting: IFormItemSetting)
    {
        if (setting.abstractControlType === abstractControlKind.groupBox) {
            this.updateFormEntityState(
                entityToSave,
                originalEntity,
                formGroup,
                (<IGroupBoxSettings>setting).fieldSettings || []
            );
        }
        else if (setting.abstractControlType === abstractControlKind.formGroup) {
            this.setFormGroupEntityStateForNewEntity(entityToSave, formGroup, setting);
        }
        else if (setting.abstractControlType === abstractControlKind.formGroupArray) {
            this.setFormGroupArrayEntityStateForNewEntity(entityToSave, formGroup, setting);
        }
    }

    private setFormGroupEntityStateForNewEntity(entityToSave: EntityType, formGroup: UntypedFormGroup, setting: IFormItemSetting)
    {
        if (!formGroup.controls[setting['field']]) {
            entityToSave[setting['field']] = null;
            return;
        }
        //Generic Repository will set entityState for all child objects to added
        //May also need to check for value recursivly in case the original entity is being initialized for insert.
        if (!formGroup.controls[setting['field']].dirty) {
            entityToSave[setting['field']] = null;
        }

        if (setting['modelType'] && entityToSave[setting['field']]) {
            entityToSave[setting['field']].typeString = setting['modelType'];
        }
    }

    private setFormGroupArrayEntityStateForNewEntity(entityToSave: EntityType, formGroup: UntypedFormGroup, setting: IFormItemSetting)
    {
        if (!formGroup.controls[setting['field']]?.dirty) {
            entityToSave[setting['field']] = null;
            return;;
        }
        //e.g. entityToSave[setting['field']] is instructor.courses,  formGroup.controls[setting['field']] is this.instructorForm.value.courses
        if (entityToSave[setting['field']]?.length) {
            for (let i in entityToSave[setting['field']]) {
                entityToSave[setting['field']][i].entityState = EntityStateType.Added;
                entityToSave[setting['field']][i].typeString = (<IFormGroupArraySettings>setting).arrayElementType;

                //Still check for enity state on child items - if the root entity state === modified then
                //the entity state for child items must be defined individually
                entityToSave[setting['field']][i] = this.updateFormEntityState(//e.g. entityToSave[setting['field']] is instructor.courses
                    entityToSave[setting['field']][i], //e.g. entityToSave[setting['field']][i] is instructor.courses[i]
                    <EntityType>{},
                    <UntypedFormGroup>(<UntypedFormArray>formGroup.controls[setting['field']]).at(Number.parseInt(i)),
                    (<IFormGroupArraySettings>setting).fieldSettings || []
                );
            }
        }
    }

    private setChildEntityStateForModifiedEntity(entityToSave: EntityType, originalEntity: EntityType, formGroup: UntypedFormGroup, setting: IFormItemSetting)
    {
        if (setting.abstractControlType === abstractControlKind.groupBox) {
            this.updateFormEntityState(
                entityToSave,
                originalEntity,
                formGroup,
                (<IGroupBoxSettings>setting).fieldSettings || []
            );
        }
        else if (setting.abstractControlType == abstractControlKind.formGroup) {
            this.setFormGroupEntityStateForModifiedEntity(entityToSave, originalEntity, formGroup, setting);
        }
        else if (setting.abstractControlType == abstractControlKind.formGroupArray) {
            this.setFormGroupArrayEntityStateForModifiedEntity(entityToSave, originalEntity, formGroup, setting);
        }
        else if (setting.abstractControlType == abstractControlKind.multiSelectFormControl) {
            this.setMultiSelectEntityStateForModifiedEntity(entityToSave, originalEntity, formGroup, setting);
        }
    }

    private setFormGroupEntityStateForModifiedEntity(entityToSave: EntityType, originalEntity: EntityType, formGroup: UntypedFormGroup, setting: IFormItemSetting)
    {
        if (!formGroup.controls[setting['field']]) {
            entityToSave[setting['field']] = null;
            return;
        }

        entityToSave[setting['field']] = {
            ...originalEntity[setting['field']],
            ...formGroup.controls[setting['field']].value
        };
        entityToSave[setting['field']] = this.updateFormEntityState(
            entityToSave[setting['field']],// instructor.officeAssignment officeAssignment is a child entity
            originalEntity[setting['field']], //original instructor.officeAssignment
            <UntypedFormGroup>formGroup.controls[setting['field']], //child form group
            (<IFormGroupSettings>setting).fieldSettings || [] //child formGroup setting
            //isInsert is always false at this point
        );

        if ((!(originalEntity?.[setting['field']])) && setting['modelType'] && entityToSave[setting['field']]) {
            entityToSave[setting['field']].typeString = setting['modelType'];
        }
    }

    private setFormGroupArrayEntityStateForModifiedEntity(entityToSave: EntityType, originalEntity: EntityType, formGroup: UntypedFormGroup, setting: IFormItemSetting)
    {
        if (!formGroup.controls[setting['field']]?.dirty) {
            entityToSave[setting['field']] = null;
            return;
        }
        //e.g. entityToSave[setting['field']] is instructor.courses,  formGroup.controls[setting['field']] is this.instructorForm.value.courses
        if (entityToSave[setting['field']]?.length) {
            for (let i in entityToSave[setting['field']]) {
                if (originalEntity[setting['field']]?.length
                    && this.itemExists<EntityType>(entityToSave[setting['field']][i], originalEntity[setting['field']], <string[]>(<IFormGroupArraySettings>setting).keyFields)) {

                    let formArray: UntypedFormArray = <UntypedFormArray>formGroup.controls[setting['field']];
                    entityToSave[setting['field']][i] = {...originalEntity[setting['field']][i], ...formArray.at(Number.parseInt(i)).value};
                    entityToSave[setting['field']][i] = this.updateFormEntityState(//e.g. entityToSave[setting['field']] is instructor.courses
                        entityToSave[setting['field']][i], //e.g. entityToSave[setting['field']][i] is instructor.courses[i]
                        originalEntity[setting['field']][i],
                        <UntypedFormGroup>formArray.at(Number.parseInt(i)),
                        (<IFormGroupArraySettings>setting).fieldSettings || []
                        //isInsert is always false at this point
                    );
                }
                else {
                    entityToSave[setting['field']][i].entityState = EntityStateType.Added;
                    entityToSave[setting['field']][i].typeString = (<IFormGroupArraySettings>setting).arrayElementType;

                    //Still check for enity state on child items - if the root entity state === modified then
                    //the entity state for child items must be defined individually
                    entityToSave[setting['field']][i] = this.updateFormEntityState(//e.g. entityToSave[setting['field']] is instructor.courses
                        entityToSave[setting['field']][i], //e.g. entityToSave[setting['field']][i] is instructor.courses[i]
                        <EntityType>{},
                        <UntypedFormGroup>(<UntypedFormArray>formGroup.controls[setting['field']]).at(Number.parseInt(i)),
                        (<IFormGroupArraySettings>setting).fieldSettings || []
                    );
                }
            }
        }

        this.markDeletedRowsInFormGroupArrayForModifiedEntity(entityToSave, originalEntity, setting);
    }

    private markDeletedRowsInFormGroupArrayForModifiedEntity(entityToSave: EntityType, originalEntity: EntityType, setting: IFormItemSetting)
    {
        if (originalEntity[setting['field']]?.length) {
            for (let i in originalEntity[setting['field']]) {
                if (entityToSave[setting['field']]?.length
                    && !this.itemExists<EntityType>(originalEntity[setting['field']][i], entityToSave[setting['field']] || [], <string[]>(<IFormGroupArraySettings>setting).keyFields)) {
                    //Add the deleted field
                    entityToSave[setting['field']][i] = originalEntity[setting['field']][i];
                    //Set its entity state to deleted.
                    entityToSave[setting['field']][i].entityState = EntityStateType.Deleted;
                }
            }
        }
    }

    private setMultiSelectEntityStateForModifiedEntity(entityToSave: EntityType, originalEntity: EntityType, formGroup: UntypedFormGroup, setting: IFormItemSetting)
    {
        if (!formGroup.controls[setting['field']]) {
            entityToSave[setting['field']] = null;
            return;
        }

        //e.g. entityToSave[setting['field']] is instructor.courses
        //entityToSave[setting['field']] = this.mergeLists(originalEntity[setting['field']] || [], formGroup.controls[setting['field']] ? formGroup.controls[setting['field']].value : [], (<IMultiSelectFormControlSettings>setting).keyFields);
        //Why was I merging the lists? Need to merge the lists to get the deleted values
        if (entityToSave[setting['field']]?.length) {
            for (let i in entityToSave[setting['field']]) {
                if (originalEntity[setting['field']]?.length
                    && this.itemExists<EntityType>(entityToSave[setting['field']][i], originalEntity[setting['field']], (<IMultiSelectFormControlSettings>setting).keyFields)) {
                    entityToSave[setting['field']][i].entityState = EntityStateType.Unchanged;
                }
                else {
                    entityToSave[setting['field']][i].entityState = EntityStateType.Added;
                    entityToSave[setting['field']][i].typeString = setting['multiSelectTemplate'].modelType;
                }
            }
        }

        if (originalEntity[setting['field']]?.length) {
            for (let i in originalEntity[setting['field']]) {
                if (!this.itemExists<EntityType>(originalEntity[setting['field']][i], entityToSave[setting['field']] || [], (<IMultiSelectFormControlSettings>setting).keyFields)) {
                    //Add the deleted field
                    let newObject: any = originalEntity[setting['field']][i];
                    newObject.entityState = EntityStateType.Deleted;
                    //Set its entity state to deleted.
                    entityToSave[setting['field']].push(newObject);
                }
            }
        }          
    }

    public itemExists<T extends Record<string, unknown>>(item: T, arr: T[], matchprops: string[]): boolean {
        return ListManager.itemExists<T>(item, arr, matchprops);
    }

    public mergeStringArray(arr1: string[], arr2: string[]): string[] {
        return ListManager.mergeStringArray(arr1, arr2);
    }
}

export class ListManager {
    static itemExists<T extends Record<string, unknown>>(item: T, arr: T[], matchprops: string[]): boolean {
        if (!matchprops) {
            throw new Error("Key fields are required: (ListManagerService.itemExists)");
        }
        let found: boolean = false;
        for (let i in arr) {
            let allKeysMetch: boolean = true;
            for (let j in matchprops) {
                if (item[matchprops[j]] !== arr[i][matchprops[j]]) {
                    allKeysMetch = false;
                    break;
                }
            }
            if (allKeysMetch) {
                found = true;
                break;
            }
        }

        return found;
    }

    static mergeStringArray(arr1: string[], arr2: string[]): string[] {
        let arr3: string[] = [];
        for (let i in arr1) {
            let shared = false;
            for (let j in arr2) {
                let allKeysMetch: boolean = true;
                if (arr2[j] != arr1[i]) {
                    allKeysMetch = false;
                }

                if (allKeysMetch) {
                    shared = true;
                    break;
                }
            }

            if (!shared) arr3.push(arr1[i])
        }

        return arr3.concat(arr2);
    }
}
