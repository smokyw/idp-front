/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export interface BaseSort {
  /**
   * Значение, по которому производится сортировка. Если не указано, то будет использовано значение по умолчанию.
   * @example "id"
   */
  attribute?: string
  /**
   * Направление сортировки. Если не указано или указано некорректно, то будет использовано значение по умолчанию.
   * @example "desc"
   */
  direction?: "asc" | "desc"
}

export interface BaseOffsetPaginationAttributeType {
  /**
   * Тип пагинации
   * @example "offset"
   */
  type?: "offset"
}

export type BaseOffsetPagination = BaseOffsetPaginationAttributeType & {
  /**
   * Номер текущей страницы. Если не указан, то будет использовано значение по умолчанию - '1'.
   * @example 1
   */
  page?: number
  /**
   * Количество элементов на странице. Если не указано, то будет использовано значение по умолчанию.
   * @example 50
   */
  per_page?: number
}

export type BaseOffsetPaginationMeta = BaseOffsetPaginationAttributeType & {
  /**
   * Номер текущей страницы
   * @example 1
   */
  current_page?: number
  /**
   * Количество элементов на странице
   * @example 50
   */
  per_page?: number
  /**
   * Общее количество элементов
   * @example 123
   */
  total?: number
}

export interface BaseCursorPaginationAttributeType {
  /**
   * Тип пагинации
   * @example "cursor"
   */
  type?: "cursor"
}

export interface BaseCursorPaginationAttributeLimit {
  /**
   * Количество элементов в выборке
   * @example 500
   */
  limit?: number
}

export interface BaseCursorPaginationAttributeAfter {
  /**
   * Курсор, от которого должен осуществляться отсчёт вперёд. По умолчанию - ID сущности.
   * @example "123"
   */
  after?: string
}

export interface BaseCursorPaginationAttributeBefore {
  /**
   * Курсор, от которого должен осуществляться отсчёт назад. По умолчанию - ID сущности.
   * @example "123"
   */
  before?: string
}

export type BaseCursorPaginationForward = BaseCursorPaginationAttributeType &
  BaseCursorPaginationAttributeLimit &
  UtilRequiredKeys<BaseCursorPaginationAttributeAfter, "after">

export type BaseCursorPaginationBackward = BaseCursorPaginationAttributeType &
  BaseCursorPaginationAttributeLimit &
  UtilRequiredKeys<BaseCursorPaginationAttributeBefore, "before">

export interface BaseCursorPaginationMeta {
  /**
   * Тип пагинации
   * @example "cursor"
   */
  type?: "cursor"
  /**
   * Количество элементов
   * @example 500
   */
  count?: number
}

export interface BaseEmptySuccessResponse {
  data?: {
    success: true
  }
}

export interface BaseError {
  /**
   * Код ошибки
   * @example "base.unknown_error"
   */
  code: string
  /**
   * Текст ошибки
   * @example "Unknown error"
   */
  message: string | null
  /**
   * Атрибут запроса, с которым связана ошибка
   * @example "login"
   */
  attribute?: string | null
  /** Stacktrace. Доступен только на тестовых окружениях */
  stack_trace?: string | null
}

export interface BaseValidationError {
  /**
   * Код ошибки
   * @example "base.validation_error"
   */
  code: "base.validation_error"
  /**
   * Текст ошибки
   * @example "Login is a required attribute"
   */
  message: string
  /**
   * Атрибут запроса, с которым связана ошибка
   * @example "login"
   */
  attribute?: string | null
}

export interface BaseObjectNotFoundError {
  /**
   * Код ошибки
   * @example "base.object_not_found"
   */
  code: "base.object_not_found"
  /**
   * Текст ошибки
   * @example "Object not found"
   */
  message: string
}

export interface BaseErrorCollectionResponse {
  data?: {
    /** Список ошибок */
    errors?: BaseError[]
  }
}

export interface BaseValidationErrorCollectionResponse {
  data?: {
    /** Список ошибок */
    errors?: BaseValidationError[]
  }
}

export interface BaseObjectNotFoundErrorCollectionResponse {
  data?: {
    /** Список ошибок */
    errors?: BaseObjectNotFoundError[]
  }
}

export interface BaseObjectNotFoundOrValidationErrorResponse {
  data?: {
    /** Список ошибок */
    errors?: (BaseValidationError | BaseObjectNotFoundError)[]
  }
}

export interface BaseConfigurationResponse {
  data?: {
    success?: {
      feature_flags?: {
        /**
         * Страница входа. Функция 'Запомнить меня'.
         * @example true
         */
        remember_me?: boolean
        /**
         * Страница входа. Функция 'Восстановить пароль'.
         * @example true
         */
        reset_password?: boolean
      }
      /** ID языка */
      language_ids?: ("ru" | "en" | "fr")[]
    }
  }
}

export interface AuthLoginRequest {
  /**
   * Логин
   * @example "your_login"
   */
  login: string
  /**
   * Пароль
   * @example "your_password"
   */
  password: string
}

export interface AuthLoginSuccessResponse {
  data?: {
    success?: {
      /**
       * Access token. Используется для последующих запросов к API.
       * @example "eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJpc3MiOiJpZHBfYm94X2F1dGhfc2VydmVyIiwic3ViIjoiZmlyc3RfdXNlciIsImV4cCI6MTY5MTc4NTg1NSwiaWF0IjoxNjkxNjk5NDU1fQ.jWFCQJ806fkwxQ555tu3lroCtJ7nxmhTkpj11IGBJpE"
       */
      access_token: string
      /**
       * Тип access token'а
       * @example "bearer"
       */
      token_type: "bearer"
      /**
       * Количество секунд, через которое access token перестанет быть активным
       * @example 86400
       */
      expires_in: number
      /**
       * Refresh token. Используется для обновления пары access token / refresh token.
       * @example "G1O8jaQj4KyGOc3-fbrIF30j5eUU_kqs9O2qDXk1"
       */
      refresh_token: string
    }
  }
}

export interface AuthRefreshTokenRequest {
  /**
   * Refresh token
   * @example "G1O8jaQj4KyGOc3-fbrIF30j5eUU_kqs9O2qDXk1"
   */
  refresh_token: string
}

export interface AuthResetPasswordForgotPasswordRequest {
  /**
   * Логин
   * @example "your_login"
   */
  login: string
}

export interface AuthResetPasswordForgotPasswordSuccessResponse {
  data?: {
    success?: {
      /**
       * Способ восстановления пароля
       * @example "email"
       */
      transport: "email"
      /**
       * Текстовое сообщение с временем жизни токена
       * @example "1 hour"
       */
      token_lifetime?: string | null
    }
  }
}

export interface AuthResetPasswordCheckTokenRequest {
  /**
   * Токен, полученный из URL
   * @example "NDQStklU3VNpnlkp1i22kVVPe4QZxk0nkJi7llE0"
   */
  token: string
}

export interface AuthPasswordRequirementAttributeMatch {
  /**
   * Тип правила
   * @example "attribute_match"
   */
  type: "attribute_match"
  /**
   * Может ли пароль совпадать с логином
   * @example false
   */
  use_login: boolean
  /**
   * Может ли пароль совпадать с email
   * @example false
   */
  use_email: boolean
  /**
   * Может ли пароль совпадать с номером телефона
   * @example false
   */
  use_phone: boolean
}

export interface AuthPasswordRequirementRegexp {
  /**
   * Тип правила
   * @example "regexp"
   */
  type: "regexp"
  /**
   * Регулярное выражение для проверки пароля
   * @example "\w{16}"
   */
  regexp: string
  /**
   * Описание регулярного выражения
   * @example "Пароль должен содержать не менее 16 символов"
   */
  hint: string
}

export interface AuthPasswordRequirementsSuccessResponse {
  data?: {
    success?: (AuthPasswordRequirementRegexp | AuthPasswordRequirementAttributeMatch)[]
  }
}

export interface AuthResetPasswordSaveNewPasswordRequest {
  /**
   * Токен, полученный из URL
   * @example "NDQStklU3VNpnlkp1i22kVVPe4QZxk0nkJi7llE0"
   */
  token: string
  /**
   * Новый пароль
   * @example "your_new_password"
   */
  password: string
}

export type AuthResetPasswordPasswordRequirementError = BaseError & {
  password_requirement: AuthPasswordRequirementRegexp | AuthPasswordRequirementAttributeMatch
}

export interface AuthResetPasswordSaveNewPasswordErrorCollectionResponse {
  data?: {
    /** Список ошибок */
    errors?: (BaseError | AuthResetPasswordPasswordRequirementError)[]
  }
}

export interface AuthLoginByExternalTokenRequest {
  /**
   * JWT, выданный 'Академией Equeo'
   * @example "eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJpc3MiOiJlcXVlb19hdXRoX3NlcnZlciIsInN1YiI6IjJuZF91c2VyIiwiY29tcGFueV9pZCI6MSwiZXhwIjoxNjkyODkzMDQ3LCJpYXQiOjE2OTI4MDY2NDd9.3uuI7Hjb_5n1JFz36Uialz8PIc7hEMLTRh-83X3U7wA"
   */
  token: string
}

export interface FeedbackNewTicketRequest {
  /**
   * Почта для ответа
   * @example "test@test.com"
   */
  email: string
  /**
   * Текст запроса
   * @example "Ничего не работает. Ничего не понятно."
   */
  text: string
}

export interface UsersAccessRightsCreateOwnTarget {
  /**
   * Право на создание собственной цели
   * @example "granted"
   */
  "app.targets.create_own_target"?: "granted" | "denied"
}

export interface UsersAccessRightsUpdateOwnTarget {
  /**
   * Право на редактирование собственной цели
   * @example "granted"
   */
  "app.targets.update_own_target"?: "granted" | "denied"
}

export interface UsersAccessRightsDeleteOwnTarget {
  /**
   * Право на удаление собственной цели
   * @example "granted"
   */
  "app.targets.delete_own_target"?: "granted" | "denied"
}

export interface UsersAccessRightsLeaveCommentsOnOwnTarget {
  /**
   * Право на оставление комментариев к собственной цели
   * @example "granted"
   */
  "app.targets.leave_comments_on_own_target"?: "granted" | "denied"
}

export interface UsersUserAttributeID {
  /**
   * ID
   * @example "my_id"
   */
  id?: string
}

export interface UsersUserAttributeEmployeeID {
  /**
   * ID сотрудника
   * @example 567
   */
  employee_id?: number
}

export interface UsersUserAttributeStatus {
  /**
   * Статус
   * @example "active"
   */
  status?: "active" | "archived"
}

export interface UsersUserAttributeEmail {
  /**
   * Email
   * @example "test@test.com"
   */
  email?: string
}

export interface UsersUserAttributeFirstName {
  /**
   * Имя
   * @example "Иван"
   */
  first_name?: string
}

export interface UsersUserAttributeLastName {
  /**
   * Фамилия
   * @example "Иванов"
   */
  last_name?: string
}

export interface UsersUserAttributeFullName {
  /**
   * Имя, фамилия
   * @example "Иван Иванов"
   */
  full_name?: string
}

export interface UsersUserAttributeAccessRights {
  access_rights?: UsersAccessRightsCreateOwnTarget &
    UsersAccessRightsUpdateOwnTarget &
    UsersAccessRightsDeleteOwnTarget &
    UsersAccessRightsLeaveCommentsOnOwnTarget
}

export interface UsersUserAttributeRole {
  /**
   * Роль
   * @example "employee"
   */
  role?: string
}

export interface UsersUserAttributeCreatedAt {
  /**
   * Дата создания
   * @example "2023-09-01 12:10:20 +03:00"
   */
  created_at?: string
}

export interface UsersProfileSuccessResponse {
  data?: {
    success?: UsersUserAttributeID &
      UsersUserAttributeEmail &
      UsersUserAttributeFirstName &
      UsersUserAttributeLastName &
      UsersUserAttributeEmployeeID &
      UsersUserAttributeAccessRights
  }
}

export type EmployeesCollectionSort = BaseSort & {
  /**
   * Значение, по которому производится сортировка. Если не указано, то будет использовано значение по умолчанию.
   * @example "created_at"
   */
  attribute?: "created_at" | "id" | "external_id" | "full_name" | "idp_status" | "idp_progress" | "idp_price"
}

export interface EmployeesCollectionFilter {
  /**
   * Год ИПР
   * @example 2023
   */
  idp_year?: number
  idp_statuses?: ("approval" | "approved" | "not_approved" | "cancelled" | "draft" | "no_idp")[] | null
  employee_statuses?: ("active" | "archived")[] | null
  /**
   * Если выбрано (true), то будут возвращены только те сотрудники, для которых текущий пользователь назначен согласующим по ИПР и в данный момент наступил его этап согласования.
   * @example true
   */
  action_required_only?: boolean | null
  /**
   * Значение из текстовой строки поиска. Используется для фильтрации по имени или ID
   * @example "some_employee_login"
   */
  text_query?: string | null
  division_ids?: number[] | null
}

export interface EmployeesCollectionRequest {
  sort?: EmployeesCollectionSort
  filter: EmployeesCollectionFilter
  pagination?: BaseOffsetPagination
}

export interface EmployeesCollectionSuccessResponse {
  data?: {
    success?: (EmployeesEmployeeAttributeID &
      EmployeesEmployeeAttributeExternalID &
      EmployeesEmployeeAttributeStatus &
      EmployeesEmployeeAttributeCreatedAt &
      EmployeesEmployeeAttributeFirstName &
      EmployeesEmployeeAttributeLastName & {
        /** ИПР */
        idp?: IdpIdpAttributeID &
          IdpIdpAttributeStatus &
          IdpIdpAttributeCountOfTargets &
          IdpIdpAttributeCountOfTargetsDone &
          IdpIdpAttributePrice & {
            /** Краткая информация о последней попытке согласования */
            last_attempt?:
              | (IdpApprovalAttemptAttributeStatus &
                  IdpApprovalAttemptAttributeInitiatedAt &
                  IdpApprovalAttemptAttributeFinishedAt & {
                    /**
                     * Количество этапов
                     * @example 3
                     */
                    count_of_stages?: number
                    /**
                     * Количество согласованных этапов
                     * @example 1
                     */
                    count_of_approved_stages?: number
                    /** Краткая информация о согласующих */
                    approvers?: (IdpRouteUser & IdpApproverAttributeStatus & IdpApproverAttributeStatusChangedAt)[]
                  })
              | null
          }
        divisions?: DivisionsDivisionBriefView[]
      })[]
  }
  meta?: {
    pagination?: BaseOffsetPaginationMeta
  }
}

export interface EmployeesCountRequest {
  filter: EmployeesCollectionFilter
}

export interface EmployeesCountSuccessResponse {
  data?: {
    success?: {
      /**
       * Количество сотрудников
       * @example 780
       */
      count?: number
    }
  }
}

export interface EmployeesEmployeeBriefDetailsSuccessResponse {
  data?: {
    success?: EmployeesEmployeeAttributeID &
      EmployeesEmployeeAttributeExternalID &
      EmployeesEmployeeAttributeFirstName &
      EmployeesEmployeeAttributeLastName & {
        idps?: IdpIdpDetailsBriefView[]
        /** Краткая информация о текущей должности. NULL, если дожность у сотрудника отсутствует. */
        position?:
          | (PositionsItemAttributeId & PositionsItemAttributeName & PositionsItemAttributePercentOfSuitability)
          | null
      }
  }
}

export interface EmployeesAccessRightsByEmployeeSuccessResponse {
  data?: {
    success?: IdpAccessRightsCreateIdp & IdpAccessRightsDeleteIdp & TargetsAccessRightsCreateTarget
  }
}

export interface PositionsItemAttributeId {
  /**
   * ID
   * @example 256
   */
  id?: number
}

export interface PositionsItemAttributeName {
  /**
   * Название
   * @example "Сварщик"
   */
  name?: string
}

export interface PositionsItemAttributePercentOfSuitability {
  /**
   * Процент соответствия. NULL, если должность не предъявляет требований к навыкам.
   * @example 25
   */
  percent_of_suitability?: number
}

export interface SkillsLevelIndicator {
  /**
   * Порядковый номер. Чем выше значение, тем лучше уровень владения навыком.
   * @example 5
   */
  id?: number
  /**
   * Описание
   * @example "Уверенно владею навыком, могу помочь и научить другого."
   */
  description?: string
  /**
   * Метка
   * @example "A"
   */
  label?: string
}

export interface SkillsLevelIndicatorsSuccessResponse {
  data?: {
    success?: SkillsLevelIndicator[]
  }
}

export interface SkillsItemAttributeID {
  /**
   * ID
   * @example 16
   */
  id?: number
}

export interface SkillsItemAttributeParentID {
  /**
   * ID родителя
   * @example 512
   */
  parent_id?: number | null
}

export interface SkillsItemAttributeName {
  /**
   * Название
   * @example "My name"
   */
  name?: string
}

export interface SkillsItemAttributeDescription {
  /**
   * Описание
   * @example "My description"
   */
  description?: string
}

export interface SkillsItemAttributeType {
  /**
   * Тип объекта
   * @example "skill"
   */
  type?: "skill" | "competency" | "competency_cluster"
}

export interface SkillsItemAttributeCompetencyClusterType {
  /**
   * Тип объекта
   * @example "competency_cluster"
   */
  type?: "competency_cluster"
}

export interface SkillsItemAttributeCompetencyType {
  /**
   * Тип объекта
   * @example "competency"
   */
  type?: "competency"
}

export interface SkillsItemAttributeSkillType {
  /**
   * Тип объекта
   * @example "skill"
   */
  type?: "skill"
}

export interface SkillsItemAttributeCurrentLevelIndicatorID {
  /**
   * Текущий уровень владения навыком, ID
   * @example 5
   */
  current_level_indicator_id?: number
}

export interface SkillsItemAttributeRequiredLevelIndicatorID {
  /**
   * Требуемый уровень владения навыком, ID
   * @example 5
   */
  required_level_indicator_id?: number
}

export type SkillsSkillParentCompetencyCluster = SkillsItemAttributeCompetencyClusterType &
  SkillsItemAttributeID &
  SkillsItemAttributeParentID &
  SkillsItemAttributeName

export type SkillsSkillParentCompetency = SkillsItemAttributeCompetencyType &
  SkillsItemAttributeID &
  SkillsItemAttributeParentID &
  SkillsItemAttributeName

export type SkillsSkillCollectionView = SkillsItemAttributeType &
  SkillsItemAttributeID &
  SkillsItemAttributeParentID &
  SkillsItemAttributeName &
  SkillsItemAttributeCurrentLevelIndicatorID &
  SkillsItemAttributeRequiredLevelIndicatorID & {
    parents?: (SkillsSkillParentCompetencyCluster | SkillsSkillParentCompetency)[]
  }

export type SkillsSkillDetailView = SkillsSkillCollectionView & SkillsItemAttributeDescription

export interface SkillsSkillDetailsSuccessResponse {
  data?: {
    success?: SkillsSkillDetailView
  }
}

export type SkillsSkillDetailBriefView = SkillsItemAttributeType &
  SkillsItemAttributeID &
  SkillsItemAttributeName &
  SkillsItemAttributeDescription

export interface SkillsSkillDetailsBriefSuccessResponse {
  data?: {
    success?: SkillsSkillDetailBriefView
  }
}

export interface SkillsTreeItemAttributeChildren {
  /** Список дочерних элементов */
  children?: any[]
}

export type SkillsTreeItemBase = SkillsItemAttributeID &
  SkillsItemAttributeParentID &
  SkillsItemAttributeName &
  SkillsTreeItemAttributeChildren

export type SkillsTreeItemCompetencyCluster = SkillsItemAttributeCompetencyClusterType & SkillsTreeItemBase

export type SkillsTreeItemCompetency = SkillsItemAttributeCompetencyType & SkillsTreeItemBase

export type SkillsTreeItemSkill = SkillsItemAttributeSkillType &
  SkillsTreeItemBase &
  SkillsItemAttributeCurrentLevelIndicatorID &
  SkillsItemAttributeRequiredLevelIndicatorID

export interface SkillsTreeRequest {
  filter?: SkillsItemAttributeName
}

export interface SkillsTreeSuccessResponse {
  data?: {
    success?: (SkillsTreeItemCompetencyCluster | SkillsTreeItemCompetency | SkillsTreeItemSkill)[]
  }
}

export interface TargetsAccessRightsCreateTarget {
  /**
   * Создание цели
   * @example "granted"
   */
  "app.targets.create_target"?: "granted" | "denied"
}

export interface TargetsMaterialToAdd {
  /**
   * ID
   * @example 256
   */
  id?: number
  /**
   * Обоснование для платного материала
   * @example "Очень надо"
   */
  reason?: string
}

export interface TargetsTargetAttributeID {
  /**
   * ID
   * @example 64
   */
  id?: number
}

export interface TargetsTargetAttributeIdpId {
  /**
   * ИПР ID
   * @example 678
   */
  idp_id?: number
}

export interface TargetsTargetAttributeName {
  /**
   * Название
   * @example "My target"
   */
  name?: string
}

export interface TargetsTargetAttributeDescription {
  /**
   * Описание
   * @example "Some description"
   */
  description?: string | null
}

export interface TargetsTargetAttributeStatus {
  /**
   * Статус
   * @example "not_started"
   */
  status?: "not_started" | "in_progress" | "done" | "cancelled"
}

export interface TargetsTargetAttributePriority {
  /**
   * Приоритет
   * @example "medium"
   */
  priority?: "low" | "medium" | "high"
}

export interface TargetsTargetAttributeDeadline {
  /**
   * Крайний срок выполнения
   * @example "2023-09-18 15:15:17 +03:00"
   */
  deadline?: string
}

export interface TargetsTargetAttributeCreatedAt {
  /**
   * Дата создания цели
   * @example "2023-09-01 12:10:20 +03:00"
   */
  created_at?: string
}

export interface TargetsTargetAttributeCountOfMaterials {
  /**
   * Количество выбранных материалов
   * @example 2
   */
  count_of_materials?: number
}

export interface TargetsTargetAttributeCountOfComments {
  /**
   * Количество комментариев
   * @example 0
   */
  count_of_comments?: number
}

export interface TargetsTargetAttributeSkills {
  skills?: (SkillsItemAttributeID & SkillsItemAttributeName)[]
}

export type TargetsTargetToUpdate = TargetsTargetAttributeName &
  TargetsTargetAttributeDescription &
  TargetsTargetAttributePriority &
  TargetsTargetAttributeDeadline & {
    /** ID навыков */
    skill_ids?: number[]
    /** Материалы */
    materials?: TargetsMaterialToAdd[]
  }

export type TargetsTargetToCreate = TargetsTargetAttributeIdpId & TargetsTargetToUpdate

export interface TargetsTargetToCreateCollection {
  /**
   * Год
   * @example 2023
   */
  year?: number
  /** ID сотрудников */
  employee_ids?: number[]
  targets?: TargetsTargetToUpdate[]
}

export type TargetsTargetBase = TargetsTargetAttributeID &
  TargetsTargetAttributeName &
  TargetsTargetAttributeStatus &
  TargetsTargetAttributePriority &
  TargetsTargetAttributeCreatedAt &
  TargetsTargetAttributeDeadline

export type TargetsFiltersIdpId = UtilRequiredKeys<TargetsTargetAttributeIdpId, "idp_id">

export interface TargetsFiltersStatusGroup {
  /**
   * Группа статусов. 'active' включает в себя статусы 'not_started', 'in_progress'. 'completed' включает в себя статусы 'done', 'cancelled'
   * @example "active"
   */
  status_group?: "active" | "completed"
}

export type TargetsCollectionSort = BaseSort & {
  /**
   * Значение, по которому производится сортировка. Если не указано, то будет использовано значение по умолчанию.
   * @example "priority"
   */
  attribute?: "priority" | "created_at" | "deadline"
}

export interface TargetsCollectionRequest {
  sort?: TargetsCollectionSort
  filter: TargetsFiltersIdpId & TargetsFiltersStatusGroup
}

export type TargetsTargetCollectionView = TargetsTargetBase &
  TargetsTargetAttributeCountOfMaterials &
  TargetsTargetAttributeCountOfComments &
  TargetsTargetAttributeSkills

export interface TargetsCollectionSuccessResponse {
  data?: {
    success?: TargetsTargetCollectionView[]
  }
}

export type TargetsTargetDetailView = TargetsTargetBase & TargetsTargetAttributeDescription

export interface TargetsTargetDetailsSuccessResponse {
  data?: {
    success?: TargetsTargetDetailView
  }
}

export interface TargetsUpdateStatusRequest {
  /** @example "not_started" */
  status?: "not_started" | "in_progress" | "done" | "cancelled"
}

export interface TargetsStatusGroup {
  /**
   * ID группы
   * @example "active"
   */
  id?: "active" | "completed"
  /**
   * Количество целей сотрудника в таком статусе
   * @example 4
   */
  count_of_targets?: number
}

export interface TargetsGetStatusGroupsRequest {
  filter: TargetsFiltersIdpId & TargetsFiltersStatusGroup
}

export interface TargetsGetStatusGroupsSuccessResponse {
  data?: {
    success?: TargetsStatusGroup[]
  }
}

export interface TargetsTargetSkillsSuccessResponse {
  data?: {
    success?: SkillsSkillCollectionView[]
  }
}

export type TargetsTargetMaterialCollectionView = MaterialsMaterialCollectionView & MaterialsItemAttributeReason

export interface TargetsTargetMaterialsSuccessResponse {
  data?: {
    success?: TargetsTargetMaterialCollectionView[]
  }
}

export type TargetsTargetMaterialDetailView = MaterialsMaterialDetailView & MaterialsItemAttributeReason

export interface TargetsTargetMaterialSuccessResponse {
  data?: {
    success?: TargetsTargetMaterialDetailView
  }
}

export interface TargetsTargetCommentsSuccessResponse {
  data?: {
    success?: CommentsComment[]
  }
}

export type TargetsLeaveCommentOnTargetRequest = CommentsCommentAttributeText

export interface TargetsCountOfRelationsSuccessResponse {
  data?: {
    success?: {
      /**
       * Количество навыков
       * @example 2
       */
      skills?: number
      /**
       * Количество материалов
       * @example 3
       */
      materials?: number
      /**
       * Количество комментариев
       * @example 2
       */
      comments?: number
    }
  }
}

export interface IdpIdpAttributeID {
  /**
   * ID
   * @example 321
   */
  id?: number
}

export interface IdpIdpAttributeYear {
  /**
   * Год
   * @example 2023
   */
  year?: number
}

export interface IdpIdpAttributeStatus {
  /**
   * Статус
   * @example "approval"
   */
  status?: "approval" | "approved" | "not_approved" | "cancelled" | "draft"
}

export interface IdpIdpAttributeCountOfTargets {
  /**
   * Количество целей в статусах, отличных от cancelled.
   * @example 5
   */
  count_of_targets?: number
}

export interface IdpIdpAttributeCountOfTargetsDone {
  /**
   * Количество выполненных целей
   * @example 2
   */
  count_of_targets_done?: number
}

export interface IdpIdpAttributePrice {
  /**
   * Сумма затрат на все платные материалы, в рублях
   * @format float
   * @example 25000
   */
  price?: number
}

export interface IdpRoute {
  stages?: IdpRouteStage[]
}

export interface IdpRouteStageAttributeID {
  /**
   * ID
   * @example 4096
   */
  id?: number
}

export interface IdpRouteStageAttributeSerialNumber {
  /**
   * Порядковый номер (1, 2, ..., N)
   * @example 1
   */
  serial_number?: number
}

export interface IdpRouteStageAttributeName {
  /**
   * Название
   * @example "Очень важный этап"
   */
  name?: string
}

export interface IdpRouteStageAttributeVoteStrategy {
  /**
   * Условие, при котором этап будет считаться согласованным. First - решение первого согласующего проэцируется на весь этап. Unanimous - этап будет считаться согласованным только если согласовали все.
   * @example "first"
   */
  vote_strategy?: "first" | "unanimous"
}

export interface IdpRouteStageAttributeStatus {
  /**
   * Статус
   * @example "none"
   */
  status?: "none" | "approved" | "not_approved"
}

export interface IdpRouteStageAttributeIsEditable {
  /**
   * Можно ли редактировать этап. Не распространяется на вложенных согласующих.
   * @example true
   */
  is_editable?: boolean
}

export interface IdpRouteStageAttributeApproverIDs {
  /** ID согласующих */
  approver_ids?: string[]
}

export interface IdpApproverAttributeStatus {
  /**
   * Статус
   * @example "none"
   */
  status?: "none" | "approved" | "not_approved"
}

export interface IdpApproverAttributeStatusChangedAt {
  /**
   * Дата изменения статуса
   * @example "2023-09-01 12:10:20 +03:00"
   */
  status_changed_at?: string | null
}

export interface IdpApproverAttributeComment {
  /**
   * Комментарий
   * @example "Комментарий к согласованию"
   */
  comment?: string
}

export interface IdpApproverAttributeIsEditable {
  /**
   * Можно ли редактировать согласующего
   * @example true
   */
  is_editable?: boolean
}

export type IdpRouteStage = IdpRouteStageAttributeSerialNumber &
  IdpRouteStageAttributeName &
  IdpRouteStageAttributeVoteStrategy & {
    /** Согласующие */
    approvers?: IdpRouteUser[]
  }

export type IdpRouteUser = UsersUserAttributeID & UsersUserAttributeFirstName & UsersUserAttributeLastName

export interface IdpApprovalAttemptAttributeID {
  /**
   * ID
   * @example 4096
   */
  id?: number
}

export interface IdpApprovalAttemptAttributeSerialNumber {
  /**
   * Порядковый номер (1, 2, ..., N)
   * @example 1
   */
  serial_number?: number
}

export interface IdpApprovalAttemptAttributeStatus {
  /**
   * Статус
   * @example "approval"
   */
  status?: "approval" | "approved" | "not_approved" | "cancelled"
}

export interface IdpApprovalAttemptAttributeInitiator {
  initiator?: IdpRouteUser
}

export interface IdpApprovalAttemptAttributeInitiatedAt {
  /**
   * Дата начала согласования
   * @example "2023-09-01 12:10:20 +03:00"
   */
  initiated_at?: string
}

export interface IdpApprovalAttemptAttributeInitiatorComment {
  /**
   * Комментарий пользователя, инициировавшего согласование
   * @example "Согласуйте, пожалуйста"
   */
  initiator_comment?: string
}

export interface IdpApprovalAttemptAttributeFinishedAt {
  /**
   * Дата завершения попытки. Завершение - это приведение к одному из статусов: cancelled, approved, not_approved.
   * @example null
   */
  finished_at?: string | null
}

export type IdpApprover = IdpRouteUser &
  IdpApproverAttributeStatus &
  IdpApproverAttributeStatusChangedAt &
  IdpApproverAttributeComment &
  IdpApproverAttributeIsEditable

export type IdpApprovalStage = IdpRouteStageAttributeID &
  IdpRouteStageAttributeSerialNumber &
  IdpRouteStageAttributeName &
  IdpRouteStageAttributeVoteStrategy &
  IdpRouteStageAttributeStatus &
  IdpRouteStageAttributeIsEditable & {
    approvers?: IdpApprover[]
  }

export type IdpApprovalAttempt = IdpApprovalAttemptAttributeID &
  IdpApprovalAttemptAttributeSerialNumber &
  IdpApprovalAttemptAttributeStatus &
  IdpApprovalAttemptAttributeInitiator &
  IdpApprovalAttemptAttributeInitiatedAt &
  IdpApprovalAttemptAttributeInitiatorComment &
  IdpApprovalAttemptAttributeFinishedAt & {
    stages?: IdpApprovalStage[]
  }

export type IdpIdpDetailsBriefView = IdpIdpAttributeID & IdpIdpAttributeYear & IdpIdpAttributeStatus

export type IdpIdpDetailsView = IdpIdpDetailsBriefView &
  IdpIdpAttributeCountOfTargets &
  IdpIdpAttributeCountOfTargetsDone &
  IdpIdpAttributePrice & {
    /**
     * Актуальная попытка, статус
     * @example "approval"
     */
    last_attempt_status?: "approval" | "approved" | "not_approved" | "cancelled" | null
    /**
     * Актуальная попытка, количество этапов
     * @example 3
     */
    last_attempt_count_of_stages?: number | null
    /**
     * Актуальная попытка, количество согласованных этапов
     * @example 0
     */
    last_attempt_count_of_approved_stages?: number | null
  }

export interface IdpGetIdpCollectionSuccessResponse {
  data?: {
    success?: IdpIdpDetailsBriefView[]
  }
}

export interface IdpGetDefaultRouteSuccessResponse {
  data?: {
    success?: IdpRoute
  }
}

export interface IdpGetIdpDetailsSuccessResponse {
  data?: {
    success?: IdpIdpDetailsView
  }
}

export interface IdpAccessRightsCreateIdp {
  /**
   * Создание ИПР
   * @example "granted"
   */
  "app.idp.create_idp"?: "granted" | "denied"
}

export interface IdpAccessRightsDeleteIdp {
  /**
   * Удаление ИПР
   * @example "granted"
   */
  "app.idp.delete_idp"?: "granted" | "denied"
}

export interface IdpAccessRightsStartApproval {
  /**
   * Запуск процесса согласования
   * @example "granted"
   */
  "app.idp.start_approval"?: "granted" | "denied"
}

export interface IdpAccessRightsCancelApproval {
  /**
   * Отменить процесс согласования
   * @example "granted"
   */
  "app.idp.cancel_approval"?: "granted" | "denied"
}

export interface IdpAccessRightsApproveStage {
  /**
   * Согласовать
   * @example "granted"
   */
  "app.idp.approve_stage"?: "granted" | "denied"
}

export interface IdpAccessRightsRejectStage {
  /**
   * Отправить на доработку
   * @example "granted"
   */
  "app.idp.reject_stage"?: "granted" | "denied"
}

export interface IdpAccessRightsUpdateRoute {
  /**
   * Редактиовать маршурт
   * @example "granted"
   */
  "app.idp.update_route"?: "granted" | "denied"
}

export interface IdpGetIdpAccessRightsSuccessResponse {
  data?: {
    success?: UtilRequiredKeys<IdpAccessRightsDeleteIdp, "app.idp.delete_idp"> &
      UtilRequiredKeys<IdpAccessRightsStartApproval, "app.idp.start_approval"> &
      IdpAccessRightsCancelApproval &
      IdpAccessRightsApproveStage &
      IdpAccessRightsRejectStage &
      IdpAccessRightsUpdateRoute
  }
}

export interface IdpGetAttemptAccessRightsSuccessResponse {
  data?: {
    success?: UtilRequiredKeys<IdpAccessRightsCancelApproval, "app.idp.cancel_approval"> &
      UtilRequiredKeys<IdpAccessRightsApproveStage, "app.idp.approve_stage"> &
      UtilRequiredKeys<IdpAccessRightsRejectStage, "app.idp.reject_stage"> &
      UtilRequiredKeys<IdpAccessRightsUpdateRoute, "app.idp.update_route">
  }
}

export interface IdpGetApprovalAttemptsRequest {
  filter?: {
    attempt_ids?: number[]
  }
}

export interface IdpGetApprovalAttemptsSuccessResponse {
  data?: {
    success?: IdpApprovalAttempt[]
  }
}

export type IdpStartApprovalAttemptRequest = {
  stages: (IdpRouteStageAttributeName &
    UtilRequiredKeys<IdpRouteStageAttributeVoteStrategy, "vote_strategy"> &
    UtilRequiredKeys<IdpRouteStageAttributeApproverIDs, "approver_ids">)[]
} & IdpApproverAttributeComment

export type IdpApproveStageOrNotRequest = IdpApproverAttributeComment

export interface IdpUpdateAttemptRouteRequest {
  /** Этапы, которые пользователь хочет сохранить */
  stages?: (IdpRouteStageAttributeID &
    IdpRouteStageAttributeName &
    IdpRouteStageAttributeVoteStrategy &
    IdpRouteStageAttributeApproverIDs)[]
}

export interface IdpUpdateAttemptRouteSuccessResponse {
  data?: {
    success?: IdpApprovalAttempt
  }
}

export interface IdpSearchForApproversRequest {
  filter?: {
    /**
     * ID этапа
     * @example 8192
     */
    stage_id: number
    /**
     * Текст для поиска по подстроке среди ФИО и прочих параметров
     * @example "some_user_login"
     */
    query?: string
  }
  pagination?: BaseCursorPaginationForward
}

export interface IdpSearchForApproversSuccessResponse {
  data?: {
    success?: IdpRouteUser[]
  }
  meta?: {
    pagination?: BaseCursorPaginationMeta
  }
}

export interface IdpGetYearsOfAllEmployeesSuccessResponse {
  data?: {
    success?: number[]
  }
}

export type IdpIdpToCreate = IdpIdpAttributeYear

export interface IdpCreateIdpSuccessResponse {
  data?: {
    success?: IdpIdpDetailsBriefView
  }
}

export type IdpIdpCollectionRequest = IdpIdpAttributeYear & {
  /** ID сотрудников */
  employee_ids?: number[]
}

export interface IdpIdpCollectionSuccessResponse {
  data?: {
    /** Задача */
    success?: TasksTaskDefaultObject
  }
}

export interface IdpIdpCheckIfAttemptActionIsAvailableSuccessResponse {
  data?: {
    success?: {
      /** Сотрудники, для которых действие доступно */
      available_employee_ids?: number[]
      /** Сотрудники, для которых действие недоступно */
      not_available_employee_ids?: number[]
    }
  }
}

export type IdpIdpApproveCollectionRequest = IdpIdpAttributeYear & {
  /** ID сотрудников */
  employee_ids?: number[]
}

export interface IdpGenerateReportsRequest {
  /** ID сотрудников */
  employee_ids?: number[]
  /** Отчёты, которые нужно сформировать */
  reports?: (TasksTaskAttributeType & {
    /** Годы, по которым осуществляется фильтрация. Если значение не передано, то будет обработана информация за все года. */
    years?: number[] | null
  })[]
}

export interface IdpGenerateReportsSuccessResponse {
  data?: {
    success?: TasksTaskDefaultObject[]
  }
}

export interface MaterialsItemAttributeCategoryType {
  /**
   * Тип объекта
   * @example "category"
   */
  type?: "category"
}

export interface MaterialsItemAttributeMaterialType {
  /**
   * Тип объекта
   * @example "material"
   */
  type?: "material"
}

export interface MaterialsItemAttributeID {
  /**
   * ID
   * @example 16
   */
  id?: number
}

export interface MaterialsItemAttributeParentID {
  /**
   * ID родителя
   * @example 512
   */
  parent_id?: number | null
}

export interface MaterialsItemAttributeName {
  /**
   * Название
   * @example "My name"
   */
  name?: string
}

export interface MaterialsItemAttributeDescription {
  /**
   * Описание
   * @example "My description"
   */
  description?: string
}

export interface MaterialsItemAttributeIsPaid {
  /**
   * Является ли материал платным
   * @example false
   */
  is_paid?: boolean
}

export interface MaterialsItemAttributeReason {
  /**
   * Обоснование
   * @example "My reason"
   */
  reason?: string | null
}

export interface MaterialsItemAttributeSkills {
  skills?: (SkillsItemAttributeID & SkillsItemAttributeName)[]
}

export interface MaterialsTreeItemAttributeChildren {
  /** Список дочерних элементов */
  children?: any[]
}

export type MaterialsTreeItemBase = MaterialsItemAttributeID &
  MaterialsItemAttributeParentID &
  MaterialsItemAttributeName &
  MaterialsTreeItemAttributeChildren

export type MaterialsTreeItemCategory = MaterialsItemAttributeCategoryType & MaterialsTreeItemBase

export type MaterialsTreeItemMaterial = MaterialsItemAttributeMaterialType &
  MaterialsTreeItemBase &
  MaterialsItemAttributeIsPaid &
  MaterialsItemAttributeSkills

export interface MaterialsTreeRequest {
  filter?: MaterialsItemAttributeName
}

export interface MaterialsTreeSuccessResponse {
  data?: {
    success?: (MaterialsTreeItemCategory | MaterialsTreeItemMaterial)[]
  }
}

export type MaterialsMaterialCollectionView = MaterialsItemAttributeID &
  MaterialsItemAttributeName &
  MaterialsItemAttributeIsPaid

export type MaterialsMaterialDetailView = MaterialsMaterialCollectionView &
  MaterialsItemAttributeDescription &
  MaterialsItemAttributeSkills

export interface MaterialsMaterialDetailsSuccessResponse {
  data?: {
    success?: MaterialsMaterialDetailView
  }
}

export interface MaterialsCollectionBySkillsRequest {
  skill_ids: number[]
}

export interface MaterialsCollectionBySkillsSuccessResponse {
  data?: {
    success?: MaterialsMaterialCollectionView[]
  }
}

export interface CommentsCommentAttributeID {
  /**
   * ID
   * @example 2048
   */
  id?: number
}

export interface CommentsCommentAttributeCreatedAt {
  /**
   * Дата оставления комментария
   * @example "2023-09-01 12:10:20 +03:00"
   */
  created_at?: string
}

export interface CommentsCommentAttributeAuthor {
  author?: UsersUserAttributeID & UsersUserAttributeRole & UsersUserAttributeFirstName & UsersUserAttributeLastName
}

export interface CommentsCommentAttributeText {
  /**
   * Текст комментария
   * @example "Your comment text"
   */
  text?: string
}

export type CommentsComment = CommentsCommentAttributeID &
  CommentsCommentAttributeCreatedAt &
  CommentsCommentAttributeAuthor &
  CommentsCommentAttributeText

export interface EmployeesEmployeeAttributeID {
  /**
   * ID
   * @example 123
   */
  id?: number
}

export interface EmployeesEmployeeAttributeExternalID {
  /**
   * Внешний ID
   * @example "my_id"
   */
  external_id?: string
}

export interface EmployeesEmployeeAttributeStatus {
  /**
   * Статус
   * @example "active"
   */
  status?: "active" | "archived"
}

export interface EmployeesEmployeeAttributeFirstName {
  /**
   * Имя
   * @example "Иван"
   */
  first_name?: string
}

export interface EmployeesEmployeeAttributeLastName {
  /**
   * Фамилия
   * @example "Иванов"
   */
  last_name?: string
}

export interface EmployeesEmployeeAttributeFullName {
  /**
   * Имя, фамилия
   * @example "Иван Иванов"
   */
  full_name?: string
}

export interface EmployeesEmployeeAttributeCreatedAt {
  /**
   * Дата создания
   * @example "2023-09-01 12:10:20 +03:00"
   */
  created_at?: string
}

export interface DivisionsItemAttributeID {
  /**
   * ID
   * @example 16
   */
  id?: number
}

export interface DivisionsItemAttributeParentID {
  /**
   * ID родителя
   * @example 512
   */
  parent_id?: number | null
}

export interface DivisionsItemAttributeName {
  /**
   * Название
   * @example "My name"
   */
  name?: string
}

export interface DivisionsTreeItemAttributeChildren {
  /** Список дочерних элементов */
  children?: any[]
}

export type DivisionsTreeItemBase = DivisionsItemAttributeID &
  DivisionsItemAttributeParentID &
  DivisionsItemAttributeName &
  DivisionsTreeItemAttributeChildren

export interface DivisionsTreeRequest {
  filter?: DivisionsItemAttributeName
}

export interface DivisionsTreeSuccessResponse {
  data?: {
    success?: DivisionsTreeItemBase[]
  }
}

export interface DivisionsDivisionBriefView {
  /**
   * ID
   * @example 512
   */
  id?: number
  /**
   * Название
   * @example "Московский филиал"
   */
  name?: string
}

export interface TasksTaskAttributeId {
  /**
   * ID
   * @example 2048
   */
  id?: number
}

export interface TasksTaskAttributeType {
  /**
   * Тип
   * @example "targets.report"
   */
  type?: "idp.status_report" | "targets.report" | "idp.approve_collection" | "materials.report"
}

export interface TasksTaskAttributeStatus {
  /**
   * Статус
   * @example "done"
   */
  status?: "new" | "in_progress" | "failed" | "done"
}

export interface TasksTaskAttributeCompletionPercent {
  /**
   * Процент исполнения
   * @example 100
   */
  completion_percent?: number | null
}

export interface TasksTaskAttributeFileId {
  /**
   * ID файла
   * @example 128
   */
  file_id?: number | null
}

/** Задача */
export type TasksTaskDefaultObject = TasksTaskAttributeId &
  TasksTaskAttributeType &
  TasksTaskAttributeStatus &
  TasksTaskAttributeCompletionPercent &
  TasksTaskAttributeFileId

export interface TasksCollectionRequest {
  pagination?: BaseCursorPaginationBackward
}

export interface TasksCollectionSuccessResponse {
  data?: {
    success?: TasksTaskDefaultObject[]
  }
  meta?: {
    pagination?: BaseCursorPaginationMeta
  }
}

export interface TasksLongPollRequest {
  /** Список ID асинхронных задач */
  ids?: number[]
}

export interface NotificationsConfigAttributeType {
  /**
   * Тип
   * @example "employee.idp_actualization"
   */
  type?: string
}

export interface NotificationsConfigAttributeAvailableModes {
  available_modes?: ("immediately" | "daily" | "never")[]
}

export interface NotificationsConfigAttributeDefaultMode {
  /** Режим по умолчанию */
  default_mode?: "immediately" | "daily" | "never"
}

export interface NotificationsConfigAttributeSelectedMode {
  /** Выбранный режим */
  selected_mode?: "immediately" | "daily" | "never"
}

export interface NotificationsSectionsSelf {
  /** Тип раздела */
  section?: "self"
  config?: (NotificationsConfigAttributeType &
    NotificationsConfigAttributeAvailableModes &
    NotificationsConfigAttributeDefaultMode &
    NotificationsConfigAttributeSelectedMode)[]
}

export interface NotificationsSectionsEmployees {
  /** Тип раздела */
  section?: "employees"
  config?: (NotificationsConfigAttributeType &
    NotificationsConfigAttributeAvailableModes &
    NotificationsConfigAttributeDefaultMode &
    NotificationsConfigAttributeSelectedMode)[]
}

export interface NotificationsGetConfigSuccessResponse {
  data?: {
    success?: (NotificationsSectionsSelf | NotificationsSectionsEmployees)[]
  }
}

/** Объекты конфигурации, которые нужно сохранить */
export interface NotificationsSaveConfigRequest {
  config?: (NotificationsConfigAttributeType & NotificationsConfigAttributeSelectedMode)[]
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.ipr.e-queo.xyz"
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"]
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&")
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key])
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&")
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ""
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>(
    { body, secure, path, type, query, format, baseUrl, cancelToken, ...params }: FullRequestParams
  ): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title IDP Box
 * @version 1.0.0
 * @baseUrl https://api.ipr.e-queo.xyz
 *
 * IDP Box API
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  configuration = {
    /**
     * @description Получить конфигурацию компании
     *
     * @tags Base
     * @name BaseGetConfiguration
     * @summary 01.01. Получить конфигурацию компании
     * @request GET:/configuration
     */
    baseGetConfiguration: (params: RequestParams = {}) =>
      this.request<BaseConfigurationResponse, BaseErrorCollectionResponse>({
        path: `/configuration`,
        method: "GET",
        format: "json",
        ...params,
      }),
  }
  auth = {
    /**
     * @description Получение токенов по логину / паролю
     *
     * @tags Auth
     * @name AuthAuthByLoginAndPassword
     * @summary 02.01. Получение токенов по логину / паролю
     * @request POST:/auth/login
     */
    authAuthByLoginAndPassword: (data: AuthLoginRequest, params: RequestParams = {}) =>
      this.request<AuthLoginSuccessResponse, BaseErrorCollectionResponse>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление токенов
     *
     * @tags Auth
     * @name AuthRefreshPairOfTokens
     * @summary 02.02. Обновление токенов
     * @request POST:/auth/refresh-token
     */
    authRefreshPairOfTokens: (data: AuthRefreshTokenRequest, params: RequestParams = {}) =>
      this.request<AuthLoginSuccessResponse, BaseErrorCollectionResponse>({
        path: `/auth/refresh-token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выход из профиля авторизации
     *
     * @tags Auth
     * @name AuthLogout
     * @summary 02.03. Выход из профиля авторизации
     * @request POST:/auth/logout
     * @secure
     */
    authLogout: (params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseErrorCollectionResponse>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Запрос на восстановление пароля
     *
     * @tags Auth
     * @name AuthResetPasswordForgotPassword
     * @summary 02.04. Запрос на восстановление пароля
     * @request POST:/auth/reset-password/forgot-password
     */
    authResetPasswordForgotPassword: (data: AuthResetPasswordForgotPasswordRequest, params: RequestParams = {}) =>
      this.request<AuthResetPasswordForgotPasswordSuccessResponse, BaseErrorCollectionResponse>({
        path: `/auth/reset-password/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверка токена для восстановления пароля
     *
     * @tags Auth
     * @name AuthResetPasswordCheckToken
     * @summary 02.05. Проверка токена для восстановления пароля
     * @request POST:/auth/reset-password/check-token
     */
    authResetPasswordCheckToken: (data: AuthResetPasswordCheckTokenRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseErrorCollectionResponse>({
        path: `/auth/reset-password/check-token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Сохранение нового пароля
     *
     * @tags Auth
     * @name AuthResetPasswordSaveNewPassword
     * @summary 02.06. Сохранение нового пароля
     * @request POST:/auth/reset-password/save-new-password
     */
    authResetPasswordSaveNewPassword: (data: AuthResetPasswordSaveNewPasswordRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, AuthResetPasswordSaveNewPasswordErrorCollectionResponse>({
        path: `/auth/reset-password/save-new-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список требований для паролей
     *
     * @tags Auth
     * @name AuthGetPasswordRequirements
     * @summary 02.07. Получить список требований для паролей
     * @request GET:/auth/password-requirements
     */
    authGetPasswordRequirements: (params: RequestParams = {}) =>
      this.request<AuthPasswordRequirementsSuccessResponse, any>({
        path: `/auth/password-requirements`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Авторизация по внешнему JWT, выданному 'Академией Equeo'
     *
     * @tags Auth
     * @name AuthAuthByExternalToken
     * @summary 02.08. Авторизация по внешнему JWT
     * @request POST:/auth/login-by-external-token
     */
    authAuthByExternalToken: (data: AuthLoginByExternalTokenRequest, params: RequestParams = {}) =>
      this.request<AuthLoginSuccessResponse, BaseErrorCollectionResponse>({
        path: `/auth/login-by-external-token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  feedback = {
    /**
     * @description Отправка сообщения в техподдержку
     *
     * @tags Feedback
     * @name FeedbackSendFeedback
     * @summary 03.01. Отправка сообщения в техподдержку
     * @request POST:/feedback
     */
    feedbackSendFeedback: (data: FeedbackNewTicketRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseErrorCollectionResponse>({
        path: `/feedback`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  users = {
    /**
     * @description Получить профиль текущего пользователя
     *
     * @tags Users
     * @name UsersGetProfile
     * @summary 04.01. Получить профиль текущего пользователя
     * @request GET:/users/profile
     * @secure
     */
    usersGetProfile: (params: RequestParams = {}) =>
      this.request<UsersProfileSuccessResponse, any>({
        path: `/users/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  skills = {
    /**
     * @description Получить дерево навыков
     *
     * @tags Skills
     * @name SkillsGetTree
     * @summary 05.01. Получить дерево навыков
     * @request POST:/skills/tree
     * @secure
     */
    skillsGetTree: (
      data: SkillsTreeRequest,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<SkillsTreeSuccessResponse, any>({
        path: `/skills/tree`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить детальную информацию о навыке
     *
     * @tags Skills
     * @name SkillsGetSkillDetails
     * @summary 05.02. Получить детальную информацию о навыке
     * @request GET:/skills/{skill_id}
     * @secure
     */
    skillsGetSkillDetails: (
      skillId: number,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<SkillsSkillDetailsSuccessResponse, any>({
        path: `/skills/${skillId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить краткую информацию о навыке
     *
     * @tags Skills
     * @name SkillsGetSkillDetailsBrief
     * @summary 05.03. Получить краткую информацию о навыке
     * @request GET:/skills/{skill_id}/brief
     * @secure
     */
    skillsGetSkillDetailsBrief: (skillId: number, params: RequestParams = {}) =>
      this.request<SkillsSkillDetailsBriefSuccessResponse, any>({
        path: `/skills/${skillId}/brief`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить все возможные индикаторы навыков
     *
     * @tags Skills
     * @name SkillsGetLevelIndicators
     * @summary 05.04. Получить все возможные индикаторы навыков
     * @request GET:/skills/level-indicators
     * @secure
     */
    skillsGetLevelIndicators: (params: RequestParams = {}) =>
      this.request<SkillsLevelIndicatorsSuccessResponse, any>({
        path: `/skills/level-indicators`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  targets = {
    /**
     * @description Получить список целей. Максимальное количество элементов - 1000.
     *
     * @tags Targets
     * @name TargetsGetCollection
     * @summary 06.01. Получить список целей
     * @request POST:/targets
     * @secure
     */
    targetsGetCollection: (
      data: TargetsCollectionRequest,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsCollectionSuccessResponse, any>({
        path: `/targets`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить детальную информацию о цели
     *
     * @tags Targets
     * @name TargetsGetTargetDetails
     * @summary 06.02. Получить детальную информацию о цели
     * @request GET:/targets/{target_id}
     * @secure
     */
    targetsGetTargetDetails: (
      targetId: number,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsTargetDetailsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/targets/${targetId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить статус цели
     *
     * @tags Targets
     * @name TargetsUpdateStatus
     * @summary 06.03. Обновить статус цели
     * @request PUT:/targets/{target_id}/update-status
     * @secure
     */
    targetsUpdateStatus: (targetId: number, data: TargetsUpdateStatusRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseObjectNotFoundOrValidationErrorResponse>({
        path: `/targets/${targetId}/update-status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить группы статусов целей
     *
     * @tags Targets
     * @name TargetsGetStatusGroups
     * @summary 06.04. Получить группы статусов целей
     * @request POST:/targets/status-groups
     * @secure
     */
    targetsGetStatusGroups: (
      data: TargetsGetStatusGroupsRequest,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsGetStatusGroupsSuccessResponse, any>({
        path: `/targets/status-groups`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создать цель
     *
     * @tags Targets
     * @name TargetsCreateTarget
     * @summary 06.05. Создать цель
     * @request POST:/targets/create
     * @secure
     */
    targetsCreateTarget: (
      data: TargetsTargetToCreate,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseEmptySuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/targets/create`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить цель
     *
     * @tags Targets
     * @name TargetsUpdateTarget
     * @summary 06.06. Обновить цель
     * @request PUT:/targets/{target_id}/update
     * @secure
     */
    targetsUpdateTarget: (targetId: number, data: TargetsTargetToUpdate, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseObjectNotFoundOrValidationErrorResponse>({
        path: `/targets/${targetId}/update`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить цель
     *
     * @tags Targets
     * @name TargetsDeleteTarget
     * @summary 06.07. Удалить цель
     * @request DELETE:/targets/{target_id}/delete
     * @secure
     */
    targetsDeleteTarget: (targetId: number, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/targets/${targetId}/delete`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить количество связанных объектов
     *
     * @tags Targets
     * @name TargetsGetCountOfRelations
     * @summary 06.08. Получить количество связанных объектов
     * @request GET:/targets/{target_id}/count-of-relations
     * @secure
     */
    targetsGetCountOfRelations: (
      targetId: number,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsCountOfRelationsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/targets/${targetId}/count-of-relations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить выбранные навыки по ID цели
     *
     * @tags Targets
     * @name TargetsGetTargetSkills
     * @summary 06.09. Получить выбранные навыки по ID цели
     * @request GET:/targets/{target_id}/skills
     * @secure
     */
    targetsGetTargetSkills: (
      targetId: number,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsTargetSkillsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/targets/${targetId}/skills`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить выбранные материалы по ID цели
     *
     * @tags Targets
     * @name TargetsGetTargetMaterials
     * @summary 06.10. Получить выбранные материалы по ID цели
     * @request GET:/targets/{target_id}/materials
     * @secure
     */
    targetsGetTargetMaterials: (
      targetId: number,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsTargetMaterialsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/targets/${targetId}/materials`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить выбранные материалы по ID цели
     *
     * @tags Targets
     * @name TargetsGetTargetMaterial
     * @summary 06.11. Получить выбранный материал по ID цели и ID материала
     * @request GET:/targets/{target_id}/materials/{material_id}
     * @secure
     */
    targetsGetTargetMaterial: (
      targetId: number,
      materialId: number,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsTargetMaterialSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/targets/${targetId}/materials/${materialId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить комментарии по ID цели
     *
     * @tags Targets
     * @name TargetsGetTargetComments
     * @summary 06.12. Получить комментарии по ID цели
     * @request GET:/targets/{target_id}/comments
     * @secure
     */
    targetsGetTargetComments: (
      targetId: number,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<TargetsTargetCommentsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/targets/${targetId}/comments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Оставить комментарий к цели
     *
     * @tags Targets
     * @name TargetsLeaveCommentOnTarget
     * @summary 06.13. Оставить комментарий к цели
     * @request POST:/targets/{target_id}/comments/leave
     * @secure
     */
    targetsLeaveCommentOnTarget: (
      targetId: number,
      data: TargetsLeaveCommentOnTargetRequest,
      params: RequestParams = {}
    ) =>
      this.request<BaseEmptySuccessResponse, BaseObjectNotFoundOrValidationErrorResponse>({
        path: `/targets/${targetId}/comments/leave`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создать несколько целей
     *
     * @tags Targets
     * @name TargetsCreateTargetCollection
     * @summary 06.14. Создать несколько целей
     * @request POST:/targets/create-collection
     * @secure
     */
    targetsCreateTargetCollection: (data: TargetsTargetToCreateCollection, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/targets/create-collection`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  idp = {
    /**
     * @description Коллекция доступных сотруднику ИПР
     *
     * @tags IDP
     * @name IdpGetCollection
     * @summary 07.01. Коллекция доступных сотруднику ИПР
     * @request GET:/idp
     * @secure
     */
    idpGetCollection: (
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<IdpGetIdpCollectionSuccessResponse, any>({
        path: `/idp`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить маршрут по умолчанию
     *
     * @tags IDP
     * @name IdpGetDefaultRoute
     * @summary 07.02. Получить маршрут по умолчанию
     * @request GET:/idp/default-route
     * @secure
     */
    idpGetDefaultRoute: (params: RequestParams = {}) =>
      this.request<IdpGetDefaultRouteSuccessResponse, any>({
        path: `/idp/default-route`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить детальную информацию об ИПР. Атрибуы count_of_targets, count_of_targets_done, price будут включены в ответ только если были указаны в query-параметре extra_attributes.
     *
     * @tags IDP
     * @name IdpGetIdpDetails
     * @summary 07.03. Получить детальную информацию об ИПР
     * @request GET:/idp/{idp_id}
     * @secure
     */
    idpGetIdpDetails: (
      idpId: number,
      query?: {
        /**
         * Массив атрибутов, которые нужно включить в ответ дополнительно.
         * @example ["first_attribute_name","second_attribute_name"]
         */
        extra_attributes?: any[]
      },
      params: RequestParams = {}
    ) =>
      this.request<IdpGetIdpDetailsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/idp/${idpId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список прав по работе с ИПР. В ответ также будут включены права по работе с последней попыткой (если такая есть).
     *
     * @tags IDP
     * @name IdpGetIdpAccessRights
     * @summary 07.04. Получить список прав по работе с ИПР
     * @request GET:/idp/{idp_id}/access-rights
     * @secure
     */
    idpGetIdpAccessRights: (idpId: number, params: RequestParams = {}) =>
      this.request<IdpGetIdpAccessRightsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/idp/${idpId}/access-rights`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список попыток согласования ИПР
     *
     * @tags IDP
     * @name IdpGetApprovalAttempts
     * @summary 07.05. Получить список попыток согласования ИПР
     * @request POST:/idp/{idp_id}/approval/attempts
     * @secure
     */
    idpGetApprovalAttempts: (idpId: number, data: IdpGetApprovalAttemptsRequest, params: RequestParams = {}) =>
      this.request<IdpGetApprovalAttemptsSuccessResponse, any>({
        path: `/idp/${idpId}/approval/attempts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Запуск согласования
     *
     * @tags IDP
     * @name IdpStartApprovalAttempt
     * @summary 07.06. Запуск согласования
     * @request POST:/idp/{idp_id}/approval/attempts/start
     * @secure
     */
    idpStartApprovalAttempt: (idpId: number, data: IdpStartApprovalAttemptRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/${idpId}/approval/attempts/start`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отмена согласования. Выполняется инициатором.
     *
     * @tags IDP
     * @name IdpCancelApprovalAttempt
     * @summary 07.07. Отмена согласования
     * @request POST:/idp/{idp_id}/approval/attempts/{attempt_id}/cancel
     * @secure
     */
    idpCancelApprovalAttempt: (idpId: number, attemptId: number, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseErrorCollectionResponse>({
        path: `/idp/${idpId}/approval/attempts/${attemptId}/cancel`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Согласовать этап маршрута. Если согласующий (авторизованный пользователь) присутствует в нескольких этапах, то будет обработан первый из несогласованных.
     *
     * @tags IDP
     * @name IdpApproveStage
     * @summary 07.08. Согласовать этап маршрута
     * @request POST:/idp/{idp_id}/approval/attempts/{attempt_id}/approve
     * @secure
     */
    idpApproveStage: (
      idpId: number,
      attemptId: number,
      data: IdpApproveStageOrNotRequest,
      params: RequestParams = {}
    ) =>
      this.request<BaseEmptySuccessResponse, BaseErrorCollectionResponse>({
        path: `/idp/${idpId}/approval/attempts/${attemptId}/approve`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отказать в согласовании этапа. Если согласующий (авторизованный пользователь) присутствует в нескольких этапах, то будет обработан первый из несогласованных.
     *
     * @tags IDP
     * @name IdpRejectStage
     * @summary 07.09. Отказать в согласовании этапа
     * @request POST:/idp/{idp_id}/approval/attempts/{attempt_id}/reject
     * @secure
     */
    idpRejectStage: (idpId: number, attemptId: number, data: IdpApproveStageOrNotRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseErrorCollectionResponse>({
        path: `/idp/${idpId}/approval/attempts/${attemptId}/reject`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить маршрут согласования.
     *
     * @tags IDP
     * @name IdpUpdateApprovalAttemptRoute
     * @summary 07.10. Обновить маршрут согласования.
     * @request PUT:/idp/{idp_id}/approval/attempts/{attempt_id}/update-route
     * @secure
     */
    idpUpdateApprovalAttemptRoute: (
      idpId: number,
      attemptId: number,
      data: IdpUpdateAttemptRouteRequest,
      params: RequestParams = {}
    ) =>
      this.request<IdpUpdateAttemptRouteSuccessResponse, BaseObjectNotFoundOrValidationErrorResponse>({
        path: `/idp/${idpId}/approval/attempts/${attemptId}/update-route`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список прав по работе с попыткой
     *
     * @tags IDP
     * @name IdpGetAttemptAccessRights
     * @summary 07.11. Получить список прав по работе с попыткой
     * @request GET:/idp/{idp_id}/approval/attempts/{attempt_id}/access-rights
     * @secure
     */
    idpGetAttemptAccessRights: (idpId: number, attemptId: number, params: RequestParams = {}) =>
      this.request<IdpGetAttemptAccessRightsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/idp/${idpId}/approval/attempts/${attemptId}/access-rights`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Поиск согласующих.
     *
     * @tags IDP
     * @name IdpSearchForApprovers
     * @summary 07.12. Поиск согласующих.
     * @request POST:/idp/{idp_id}/approval/approvers/search
     * @secure
     */
    idpSearchForApprovers: (idpId: number, data: IdpSearchForApproversRequest, params: RequestParams = {}) =>
      this.request<IdpSearchForApproversSuccessResponse, any>({
        path: `/idp/${idpId}/approval/approvers/search`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить все возможные года, которые есть в ИПР сотрудников
     *
     * @tags IDP
     * @name IdpGetYearsOfAllEmployees
     * @summary 07.13. Получить все возможные года, которые есть в ИПР сотрудников
     * @request GET:/idp/years-of-all-employees
     * @secure
     */
    idpGetYearsOfAllEmployees: (params: RequestParams = {}) =>
      this.request<IdpGetYearsOfAllEmployeesSuccessResponse, any>({
        path: `/idp/years-of-all-employees`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создать ИПР
     *
     * @tags IDP
     * @name IdpCreateIdp
     * @summary 07.14. Создать ИПР
     * @request POST:/idp/create
     * @secure
     */
    idpCreateIdp: (
      data: IdpIdpToCreate,
      query?: {
        /**
         * ID сотрудника. Если не указан, то пытаемся получить из текущего пользователя.
         * @example 123
         */
        employee_id?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<IdpCreateIdpSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/create`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить ИПР
     *
     * @tags IDP
     * @name IdpDeleteIdp
     * @summary 07.15. Удалить ИПР
     * @request DELETE:/idp/{idp_id}/delete
     * @secure
     */
    idpDeleteIdp: (idpId: number, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/idp/${idpId}/delete`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создать несколько ИПР
     *
     * @tags IDP
     * @name IdpMassCreateIdp
     * @summary 07.16. Создать несколько ИПР
     * @request POST:/idp/create-collection
     * @secure
     */
    idpMassCreateIdp: (data: IdpIdpCollectionRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/create-collection`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Можно ли согласовать ИПР для нескольких сотрудников
     *
     * @tags IDP
     * @name IdpCheckIfApprovalIsAvailable
     * @summary 07.17. Можно ли согласовать ИПР для нескольких сотрудников
     * @request POST:/idp/check-if-approval-is-available
     * @secure
     */
    idpCheckIfApprovalIsAvailable: (data: IdpIdpCollectionRequest, params: RequestParams = {}) =>
      this.request<IdpIdpCheckIfAttemptActionIsAvailableSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/check-if-approval-is-available`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Согласовать ИПР для нескольких сотрудников
     *
     * @tags IDP
     * @name IdpApproveCollection
     * @summary 07.18. Согласовать ИПР для нескольких сотрудников
     * @request POST:/idp/approve-collection
     * @secure
     */
    idpApproveCollection: (data: IdpIdpCollectionRequest, params: RequestParams = {}) =>
      this.request<IdpIdpCollectionSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/approve-collection`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Можно ли отправить на доработку ИПР для нескольких сотрудников
     *
     * @tags IDP
     * @name IdpCheckIfRejectionIsAvailable
     * @summary 07.19. Можно ли отправить на доработку ИПР для нескольких сотрудников
     * @request POST:/idp/check-if-rejection-is-available
     * @secure
     */
    idpCheckIfRejectionIsAvailable: (data: IdpIdpCollectionRequest, params: RequestParams = {}) =>
      this.request<IdpIdpCheckIfAttemptActionIsAvailableSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/check-if-rejection-is-available`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отправить на доработку ИПР для нескольких сотрудников
     *
     * @tags IDP
     * @name IdpRejectCollection
     * @summary 07.20. Отправить на доработку ИПР для нескольких сотрудников
     * @request POST:/idp/reject-collection
     * @secure
     */
    idpRejectCollection: (data: IdpIdpCollectionRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/reject-collection`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Сформировать отчёты
     *
     * @tags IDP
     * @name IdpGenerateReports
     * @summary 07.21. Сформировать отчёты
     * @request POST:/idp/generate-reports
     * @secure
     */
    idpGenerateReports: (data: IdpGenerateReportsRequest, params: RequestParams = {}) =>
      this.request<IdpGenerateReportsSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/idp/generate-reports`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  materials = {
    /**
     * @description Получить дерево материалов
     *
     * @tags Materials
     * @name MaterialsGetTree
     * @summary 08.01. Получить дерево материалов
     * @request POST:/materials/tree
     * @secure
     */
    materialsGetTree: (data: MaterialsTreeRequest, params: RequestParams = {}) =>
      this.request<MaterialsTreeSuccessResponse, any>({
        path: `/materials/tree`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить детальную информацию о материале
     *
     * @tags Materials
     * @name MaterialsGetMaterialDetails
     * @summary 08.02. Получить детальную информацию о материале
     * @request GET:/materials/{material_id}
     * @secure
     */
    materialsGetMaterialDetails: (materialId: number, params: RequestParams = {}) =>
      this.request<MaterialsMaterialDetailsSuccessResponse, any>({
        path: `/materials/${materialId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список материалов по ID навыков.
     *
     * @tags Materials
     * @name MaterialsGetBySkills
     * @summary 08.03. Получить список материалов по ID навыков.
     * @request POST:/materials/by-skills
     * @secure
     */
    materialsGetBySkills: (data: MaterialsCollectionBySkillsRequest, params: RequestParams = {}) =>
      this.request<MaterialsCollectionBySkillsSuccessResponse, any>({
        path: `/materials/by-skills`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  employees = {
    /**
     * @description Получить список сотрудников
     *
     * @tags Employees
     * @name EmployeesGetCollection
     * @summary 09.01. Получить список сотрудников
     * @request POST:/employees
     * @secure
     */
    employeesGetCollection: (data: EmployeesCollectionRequest, params: RequestParams = {}) =>
      this.request<EmployeesCollectionSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/employees`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить количество сотрудников
     *
     * @tags Employees
     * @name EmployeesGetCount
     * @summary 09.02. Получить количество сотрудников
     * @request POST:/employees/count
     * @secure
     */
    employeesGetCount: (data: EmployeesCountRequest, params: RequestParams = {}) =>
      this.request<EmployeesCountSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/employees/count`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить краткую информацию о сотруднике. Атрибуты idps, position будут включены в ответ только если были указаны в query-параметре extra_attributes.
     *
     * @tags Employees
     * @name EmployeesGetEmployeeBriefDetails
     * @summary 09.03. Получить краткую информацию о сотруднике
     * @request GET:/employees/{employee_id}
     * @secure
     */
    employeesGetEmployeeBriefDetails: (
      employeeId: number,
      query?: {
        /**
         * Массив атрибутов, которые нужно включить в ответ дополнительно.
         * @example ["first_attribute_name","second_attribute_name"]
         */
        extra_attributes?: any[]
      },
      params: RequestParams = {}
    ) =>
      this.request<EmployeesEmployeeBriefDetailsSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/employees/${employeeId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить права доступа в отношении сотрудника.
     *
     * @tags Employees
     * @name EmployeesGetAccessRightsByEmployee
     * @summary 09.04. Получить права доступа в отношении сотрудника.
     * @request GET:/employees/{employee_id}/access-rights
     * @secure
     */
    employeesGetAccessRightsByEmployee: (employeeId: number, params: RequestParams = {}) =>
      this.request<EmployeesAccessRightsByEmployeeSuccessResponse, BaseObjectNotFoundErrorCollectionResponse>({
        path: `/employees/${employeeId}/access-rights`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  divisions = {
    /**
     * @description Получить дерево элементов орг. структуры
     *
     * @tags Divisions
     * @name DivisionsGetTree
     * @summary 10.01. Получить дерево элементов орг. структуры
     * @request POST:/divisions/tree
     * @secure
     */
    divisionsGetTree: (data: DivisionsTreeRequest, params: RequestParams = {}) =>
      this.request<DivisionsTreeSuccessResponse, any>({
        path: `/divisions/tree`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  tasks = {
    /**
     * @description Получить список асинхронных задач
     *
     * @tags Tasks
     * @name TasksGetCollection
     * @summary 11.01. Получить список асинхронных задач
     * @request POST:/tasks
     * @secure
     */
    tasksGetCollection: (data: TasksCollectionRequest, params: RequestParams = {}) =>
      this.request<TasksCollectionSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/tasks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Очистить список асинхронных задач
     *
     * @tags Tasks
     * @name TasksDeleteAll
     * @summary 11.02. Очистить список асинхронных задач
     * @request DELETE:/tasks
     * @secure
     */
    tasksDeleteAll: (params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, any>({
        path: `/tasks`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Скрыть асинхронную задачу из списка
     *
     * @tags Tasks
     * @name TasksDeleteOne
     * @summary 11.03. Скрыть асинхронную задачу из списка
     * @request DELETE:/tasks/{task_id}
     * @secure
     */
    tasksDeleteOne: (taskId: number, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, any>({
        path: `/tasks/${taskId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Запросить статус асинхронных задач. Если хотя бы одна из задач, ID которых передан в теле запроса, находится в процессе исполнения, то backend будет ждать её завершения. Timeout ожидания - 30 секунд.
     *
     * @tags Tasks
     * @name TasksLongPoll
     * @summary 11.04. Запросить статус асинхронных задач
     * @request POST:/tasks/long-poll
     * @secure
     */
    tasksLongPoll: (data: TasksLongPollRequest, params: RequestParams = {}) =>
      this.request<TasksCollectionSuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/tasks/long-poll`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
  files = {
    /**
     * @description Скачать файл
     *
     * @tags Files
     * @name FilesDownloadOne
     * @summary 12.01. Скачать файл
     * @request GET:/files/{file_id}/download
     * @secure
     */
    filesDownloadOne: (fileId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/files/${fileId}/download`,
        method: "GET",
        secure: true,
        ...params,
      }),
  }
  notifications = {
    /**
     * @description Получить настройки уведомлений. Секция 'self' присутствует всегда. Секция 'employees' будет добавлена если у пользователя есть хотя бы один сотрудник.
     *
     * @tags Notifications
     * @name NotificationsGetConfig
     * @summary 13.01. Получить настройки уведомлений
     * @request GET:/notifications/config
     * @secure
     */
    notificationsGetConfig: (params: RequestParams = {}) =>
      this.request<NotificationsGetConfigSuccessResponse, any>({
        path: `/notifications/config`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Сохранить настройки уведомлений
     *
     * @tags Notifications
     * @name NotificationsSaveConfig
     * @summary 13.02. Сохранить настройки уведомлений
     * @request POST:/notifications/config
     * @secure
     */
    notificationsSaveConfig: (data: NotificationsSaveConfigRequest, params: RequestParams = {}) =>
      this.request<BaseEmptySuccessResponse, BaseValidationErrorCollectionResponse>({
        path: `/notifications/config`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
}
