<%@ include file="/WEB-INF/jsp/include/imports.jsp" %>
<%--
  Copyright 2014 Hippo B.V. (http://www.onehippo.com)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  --%>

<%--@elvariable id="document" type="SkillsUpStudents.beans.ContentDocument"--%>
<c:if test="${not empty document}">
  <hst:link var="link" hippobean="${document}"/>
  <article class="has-edit-button">
    <hst:cmseditlink hippobean="${document}"/>
    <h3><a href="${link}"><c:out value="${document.title}"/></a></h3>
    <c:if test="${hst:isReadable(document, 'publicationdate.time')}">
      <p>
        <fmt:formatDate value="${document.publicationDate.time}" type="both" dateStyle="medium" timeStyle="short"/>
      </p>
    </c:if>

    <c:if test="${not empty document.introduction}">
      <p><c:out value="${document.introduction}"/></p>
    </c:if>
    <%--<hst:html hippohtml="${document.content}"/>--%>
      <%@ include file="/WEB-INF/jsp/hstdefault/registration-page.jsp" %>
  </article>
</c:if>
<%--@elvariable id="editMode" type="java.lang.Boolean"--%>
<c:if test="${editMode && empty document}">
  <img src="<hst:link path='/images/essentials/catalog-component-icons/simple-content.png'/>"> Click to edit Simple Content
</c:if>
